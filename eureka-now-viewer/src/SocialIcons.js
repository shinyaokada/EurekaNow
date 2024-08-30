import React from 'react';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // LocationOnアイコンをインポート
import InstagramIcon from '@mui/icons-material/Instagram';

const SocialIcons = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* グーグルマップのURLにリンクされたアイコンボタン */}
      <Link href="https://maps.app.goo.gl/E7WpZXiVgX8kL96R8" target="_blank" rel="noopener">
        <IconButton>
          <LocationOnIcon fontSize="large" /> {/* LocationOnアイコンを使用 */}
        </IconButton>
      </Link>

      {/* InstagramのURLにリンクされたアイコンボタン */}
      <Link href="https://www.instagram.com/eureka_tokushimacoworking" target="_blank" rel="noopener">
        <IconButton>
          <InstagramIcon fontSize="large" />
        </IconButton>
      </Link>
    </div>
  );
};

export default SocialIcons;
