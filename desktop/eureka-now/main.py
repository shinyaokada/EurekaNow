reimport flet as ft
import requests
import nfc
import threading
import time  

BACKEND_URL = "https://eureka-now-backend.vercel.app/"  # ご使用のバックエンドURLに変更してください

def main(page: ft.Page):
    # ページの設定
    page.title = "EurekaNow"
    page.padding = 20
    page.bgcolor = "#FFFBF0"
    
    # 見出しを中央に表示
    title = ft.Container(
        content=ft.Text("EurekaNow", size=36, color="#FFA500", weight=ft.FontWeight.BOLD),
        alignment=ft.alignment.center
    )

    # Checked-in Usersセクション
    checked_in_box = ft.Container(
        content=ft.Column(
            [ft.Text("Checked-in Users", color="#FFA500", size=18, weight=ft.FontWeight.BOLD)],
            alignment=ft.MainAxisAlignment.START,
            spacing=10,
            width=200,
            height=300,
        ),
        padding=10,
        border=ft.border.all(1, "#FFA500")
    )
    
    # Checked-in Usersを表示するためのカラム
    checked_in_users_column = ft.Column(spacing=5)
    checked_in_box.content.controls.append(checked_in_users_column)

    # Registered Usersセクション
    registered_users_box = ft.Container(
        content=ft.Column(
            [ft.Text("Registered Users", color="#FFA500", size=18, weight=ft.FontWeight.BOLD)],
            alignment=ft.MainAxisAlignment.START,
            spacing=10,
            width=200,
            height=300,
            scroll=ft.ScrollMode.AUTO
        ),
        padding=10,
        border=ft.border.all(1, "#FFA500")
    )

    
    
    # Registered Usersを表示するためのカラム
    registered_users_column = ft.Column(spacing=5)
    registered_users_box.content.controls.append(registered_users_column)

    # Registerセクション
    name_input = ft.TextField(label="Enter your name", bgcolor="white")

    register_box = ft.Container(
        content=ft.Column(
            [
                ft.Text("Register", color="#FFA500", size=18, weight=ft.FontWeight.BOLD),
                name_input,
                ft.ElevatedButton("Register", bgcolor="#FFA500", color="white", on_click=lambda e: register_user())
            ],
            alignment=ft.MainAxisAlignment.START,
            spacing=10,
            width=200,
        ),
        padding=10
    )

    # 全体のレイアウト
    layout = ft.Row(
        [checked_in_box, registered_users_box, register_box],
        alignment=ft.MainAxisAlignment.CENTER,
        spacing=20
    )

    # ページにコンテンツを追加
    page.add(title, layout)

    nfc_display = ft.Text(value="Touch an NFC card to read data.", color="#FFA500", size=16)

    # ユーザーを取得して表示する関数
    def fetch_users():
        try:
            checked_in_users_column.controls.clear()
            registered_users_column.controls.clear()
            response = requests.get(f"{BACKEND_URL}/users")
            if response.status_code == 200:
                users = response.json()
                for user in users:
                    print(user)
                    user_button = ft.ElevatedButton(
                        user["name"],
                        bgcolor="#FFFF66" if user["isCheckedIn"] else "#FFFFFF",
                        color="#FFA500",
                        expand=True,
                        on_click=lambda e, user_id=user["_id"]: toggle_check_in(user_id)
                    )
                    if(user["isCheckedIn"]):
                        checked_in_users_column.controls.append(user_button)
                    else:
                        registered_users_column.controls.append(user_button)

                page.update()
        except requests.RequestException as e:


            
            print("Failed to fetch users:", e)

    # ユーザーのチェックイン状態を切り替える関数
    def toggle_check_in(user_id):
        """ユーザーのチェックイン状態を切り替える関数"""
        try:
            response = requests.put(f"{BACKEND_URL}/users/{user_id}")
            if response.status_code == 200:
                user = response.json()
                print(f"User {user['name']} check-in status updated.(id={user_id})")
                fetch_users()
            else:
                print(f"Failed to toggle check-in for user {user_id}: {response.status_code}")
        except requests.RequestException as e:
            print("Failed to update user status:", e)

    # 新規ユーザーを登録する関数
    def register_user():
        name = name_input.value
        if name:
            try:
                response = requests.post(f"{BACKEND_URL}/users", json={"name": name})
                if response.status_code == 200:
                    new_user = response.json()
                    registered_users_column.controls.append(
                        ft.ElevatedButton(new_user["name"], bgcolor="#FFFF66", color="#FFA500", expand=True)
                    )
                    name_input.value = ""  # 入力フィールドをクリア
                    page.update()
            except requests.RequestException as e:
                print("Failed to register user:", e)

    def show_nfc_popup(data):
        """NFCのデータをポップアップで表示"""

        page.overlay.append(
            ft.AlertDialog(
                title=ft.Text("NFC Data"),
                content=ft.Text(f"Card Data: {data}"),
                actions=[ft.TextButton("OK", on_click=lambda e: page.overlay.clear())],
            )
        )
        page.update()

    
    last_user_id = None
    last_read_time = 0
    lock = threading.Lock()  # スレッドの安全な処理のためのLock

    def read_nfc():
        """NFCカードのデータを読み取る関数"""
        nonlocal last_user_id, last_read_time
        try:
            clf = nfc.ContactlessFrontend('usb')  # USB接続のNFCリーダー
            while True:
                tag = clf.connect(rdwr={'on-connect': lambda tag: False})
                if tag:
                    card_data = tag.ndef.records[0].text # タグのデータを文字列化
                    print(f"NFC Card Read: {card_data}")
                    nfc_display.value = f"Last NFC Read: {card_data}"

                    # NFCカードのデータを使ってチェックイン処理
                    user_id = card_data.strip()  # 必要に応じて整形
                    current_time = time.time()
                    
                    if user_id == last_user_id and current_time - last_read_time < 3:
                        continue

                    last_user_id = user_id
                    last_read_time = current_time
                    toggle_check_in(user_id)

                    # ポップアップを表示
                    show_nfc_popup(f"User ID: {user_id}")
                    page.update()
        except Exception as e:
            print("NFC Error:", e)
        finally:
            if clf:
                clf.close()
    # NFCスレッドを開始
    threading.Thread(target=read_nfc, daemon=True).start()


    # ユーザーのデータを最初に取得
    fetch_users()

# Fletアプリケーションを開始
ft.app(target=main)