import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPartners } from '../api/partners';
import api from '../api/axios';
import machineBg from '../assets/machineBG.jpeg';
import placeholderImg from '../assets/placeholder.svg';
import showcaseBg from '../assets/showcase_bg.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SEO from '../components/SEO';

const GOLD = '#a37a39';

function makeIcon(avatarUrl, name, active) {
  const sz = active ? 46 : 40;
  const circR = active ? 17 : 14;
  const circCx = active ? 23 : 20;
  const circCy = active ? 20 : 17;
  const imgUrl = avatarUrl || placeholderImg;

  const pinSvg = `<svg width="${sz}" height="${sz + 14}" viewBox="0 0 ${sz} ${sz + 14}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="filter:drop-shadow(0 ${active ? 3 : 2}px ${active ? 8 : 5}px rgba(180,40,40,${active ? 0.7 : 0.5}))">
    <defs>
      <radialGradient id="g${active ? 'a' : 'b'}" cx="35%" cy="25%" r="70%">
        <stop offset="0%" stop-color="${active ? '#ff6b6b' : '#ff5555'}"/>
        <stop offset="45%" stop-color="${active ? '#e74c3c' : '#c0392b'}"/>
        <stop offset="100%" stop-color="${active ? '#a93226' : '#922b21'}"/>
      </radialGradient>
      <clipPath id="c${active ? 'a' : 'b'}">
        <circle cx="${circCx}" cy="${circCy}" r="${circR - 1.5}"/>
      </clipPath>
    </defs>
    <path d="M${circCx} ${sz + 13}C${circCx} ${sz + 13} ${3} ${circCy + 16} ${3} ${circCy}C${3} ${circCy - circR + 2} ${circCx - circR} ${2} ${circCx} ${2}C${circCx + circR} ${2} ${sz - 3} ${circCy - circR + 2} ${sz - 3} ${circCy}C${sz - 3} ${circCy + 16} ${circCx} ${sz + 13} ${circCx} ${sz + 13}Z" fill="url(#g${active ? 'a' : 'b'})" stroke="${active ? '#fff' : 'rgba(255,255,255,0.5)'}" stroke-width="${active ? 2 : 1.5}"/>
    <circle cx="${circCx}" cy="${circCy}" r="${circR}" fill="#1a1a1a" stroke="${active ? '#fff' : 'rgba(255,255,255,0.5)'}" stroke-width="${active ? 2 : 1.5}"/>
    <image href="${imgUrl}" x="${circCx - circR + 1.5}" y="${circCy - circR + 1.5}" width="${(circR - 1.5) * 2}" height="${(circR - 1.5) * 2}" clip-path="url(#c${active ? 'a' : 'b'})" preserveAspectRatio="xMidYMid slice"/>
  </svg>`;

  return L.divIcon({
    className: '',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:${sz}px;height:${sz + 14}px">${pinSvg}</div>`,
    iconSize: [sz, sz + 14],
    iconAnchor: [sz / 2, sz + 14],
  });
}

function popupHtml(p, navigate) {
  return `<div onclick="(function(){window.__partnerNav(${p.id})})()" style="
    width:230px;border-radius:12px;overflow:hidden;border:1px solid ${GOLD};
    cursor:pointer;background:#111;font-family:Georgia,'Times New Roman',Times,serif;
  ">
    <div style="height:65px;background:url(${showcaseBg}) center/cover no-repeat;border-bottom:1px solid ${GOLD}"></div>
    <div style="padding:14px;text-align:center;position:relative;margin-top:-24px">
      <div style="width:48px;height:48px;border-radius:50%;border:3px solid ${GOLD};overflow:hidden;margin:0 auto 6px;background:#111;box-shadow:0 0 12px ${GOLD}44">
        ${p.avatar_url
          ? `<img src="${p.avatar_url}" style="width:100%;height:100%;object-fit:cover" />`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:${GOLD};font-size:18px;font-weight:700;background:#1a1a1a">${p.name?.charAt(0).toUpperCase()}</div>`
        }
      </div>
      <div style="color:#d4af37;font-size:14px;font-weight:700;margin-bottom:2px">${p.name}</div>
      <div style="color:#666;font-size:10px;margin-top:6px;font-style:italic">Click to view profile</div>
    </div>
  </div>`;
}

export default function PartnerMap() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.__partnerNav = (id) => navigate(`/profile/${id}`);
    return () => { delete window.__partnerNav; };
  }, [navigate]);

  const loadPartners = () => {
    setLoading(true);
    setError(null);
    getPartners().then((res) => setPartners(res.data)).catch(() => setError('Failed to load partners. Please try again.')).finally(() => setLoading(false));
  };

  useEffect(() => { loadPartners(); }, []);

  const extractCoords = (p) => {
    if (p.latitude && p.longitude) return [parseFloat(p.latitude), parseFloat(p.longitude)];

    const url = p.business_location || '';
    const m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) return [parseFloat(m[1]), parseFloat(m[2])];
    return null;
  };

  const [resolvedCoords, setResolvedCoords] = useState({});

  useEffect(() => {
    const todo = partners.filter((p) => {
      if (p.latitude && p.longitude) return false;
      const url = p.business_location || '';
      return url.includes('goo.gl') || url.includes('google');
    });
    if (todo.length === 0) return;
    todo.forEach(async (p) => {
      try {
        const res = await api.get('/resolve-url', { params: { url: p.business_location } });
        if (res.data && res.data.lat != null && res.data.lng != null) {
          const lat = parseFloat(res.data.lat);
          const lng = parseFloat(res.data.lng);
          if (!isNaN(lat) && !isNaN(lng)) {
            setResolvedCoords((prev) => ({ ...prev, [p.id]: [lat, lng] }));
          }
        }
      } catch {}
    });
  }, [partners]);

  useEffect(() => {
    if (loading || partners.length === 0) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 19,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Esri',
      }).addTo(mapInstance.current);

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Esri',
      }).addTo(mapInstance.current);

      mapInstance.current.zoomControl.setPosition('topright');
    }

    const map = mapInstance.current;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    partners.forEach((p) => {
      const coords = extractCoords(p) || resolvedCoords[p.id];
      if (!coords) return;

      const [lat, lng] = coords;

      const marker = L.marker([lat, lng], {
        icon: makeIcon(p.avatar_url, p.name, false),
        riseOnHover: true,
      }).addTo(map);

      marker.bindPopup(popupHtml(p, navigate), {
        closeButton: false,
        className: 'partner-popup',
        offset: [0, -30],
        maxWidth: 250,
      });

      marker.on('click', () => {
        markersRef.current.forEach((m) => {
          if (m !== marker) m.setIcon(makeIcon(m.pAvatar, m.pName, false));
        });
        marker.setIcon(makeIcon(p.avatar_url, p.name, true));
      });

      marker.on('popupclose', () => {
        marker.setIcon(makeIcon(p.avatar_url, p.name, false));
      });

      marker.pAvatar = p.avatar_url;
      marker.pName = p.name;

      markersRef.current.push(marker);
    });

  }, [loading, partners, navigate, resolvedCoords]);

  return (
    <div style={styles.page}>
      <SEO title="Partner Map" description="Find PRO CNC MAROC partners across Morocco. Our network of CNC professionals covers Casablanca, Rabat, Marrakech, Tangier, Fes &amp; more. Locate a partner near you." canonicalUrl="/partner-map" keywords="CNC partners Morocco, CNC network, machining partners, CNC Morocco cities" />
      <div style={styles.overlay}>
        <motion.h1 style={styles.title} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>Partner Map</motion.h1>
        <motion.p style={styles.sub} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>Our trusted partners around the world</motion.p>

        <motion.div style={styles.mapWrap}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
        >
          <div ref={mapRef} style={styles.map} />
          {loading && (
            <div style={styles.loaderWrap}>
              <div style={styles.loader} />
            </div>
          )}
          {error && !loading && (
            <div style={styles.loaderWrap}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#ff6b6b', marginBottom: '12px' }}>{error}</p>
                <button onClick={loadPartners} style={styles.retryBtn}>Try Again</button>
              </div>
            </div>
          )}
          {!loading && !error && partners.length === 0 && (
            <p style={styles.empty}>No partners registered yet</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: `url(${machineBg}) center/cover fixed no-repeat`,
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  overlay: {
    minHeight: '100vh',
    background: 'rgba(0,0,0,0.7)',
    padding: 'clamp(24px, 4vw, 50px) clamp(16px, 4vw, 60px)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  title: {
    color: '#d4af37', fontSize: 'clamp(26px, 3.5vw, 40px)',
    fontWeight: 800, marginBottom: '4px', textAlign: 'center',
    letterSpacing: '1px',
  },
  sub: {
    color: '#bbb', fontSize: 'clamp(13px, 1.3vw, 16px)',
    marginBottom: 'clamp(20px, 2.5vw, 32px)', textAlign: 'center',
  },
  mapWrap: {
    width: '100%',
    height: 'clamp(400px, 60vw, 750px)',
    maxWidth: '1200px',
    borderRadius: '16px',
    border: `1px solid ${GOLD}`,
    boxShadow: `0 0 40px ${GOLD}22, 0 0 80px ${GOLD}11`,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loaderWrap: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.6)', zIndex: 1000,
  },
  loader: {
    width: '40px', height: '40px',
    border: '3px solid #333', borderTopColor: GOLD,
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  empty: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#666', fontSize: '16px', zIndex: 1000,
  },
  retryBtn: {
    background: '#a37a39', color: '#fff', border: 'none', padding: '10px 28px',
    borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
  },
};
