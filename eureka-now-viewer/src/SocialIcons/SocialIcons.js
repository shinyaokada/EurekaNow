import React from 'react';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import "./SocialIcons.css";

const SocialIcons = () => {
  return (
    <div className="social-icons-container">
      <Link href="https://maps.app.goo.gl/E7WpZXiVgX8kL96R8" target="_blank" rel="noopener">
        <IconButton className="social-icon-button" > 
          <LocationOnIcon style={{ fontSize: '3rem' }}/>{/*直接フォントサイズを指定しないとなぜか反映されない。*/}
        </IconButton>
      </Link>
      <Link href="https://www.instagram.com/eureka_tokushimacoworking" target="_blank" rel="noopener">
        <IconButton className="social-icon-button">
          <InstagramIcon style={{ fontSize: '3rem' }}/>{/*直接フォントサイズを指定しないとなぜか反映されない。*/}
        </IconButton>
      </Link>
    </div>
  );
};

export default SocialIcons;