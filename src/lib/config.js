export const cvChapters = {
    'mdr': {
        title: 'MDR Sachsen-Anhalt',
        content: 'As part of a university project, I developed a data-driven story about the new MDR state broadcasting center in Magdeburg. This project involved analyzing the urban context and creating a narrative about the building\'s significance.',
        location: {
            center: [11.6276, 52.1276], // Magdeburg
            zoom: 14,
            pitch: 50,
        },
        layers: [
            { id: 'mdr-anker', path: '/data/magdeburg/Landesfunkhaus_des_MDR/1_anker.geojson', color: '#ff7f50' },
            { id: 'mdr-kontext', path: '/data/magdeburg/Landesfunkhaus_des_MDR/2_kontext.geojson', color: '#6495ed' },
            { id: 'mdr-erzaehlung', path: '/data/magdeburg/Landesfunkhaus_des_MDR/3_erzaehlung.geojson', color: '#ff69b4' },
        ]
    },
    '3dqr': {
        title: '3DQR',
        content: 'During my time at 3DQR, a company specializing in augmented reality solutions, I worked on projects that blended digital information with the physical world. This experience gave me a deep understanding of spatial data and its applications.',
        location: {
            center: [11.6276, 52.1276], // Magdeburg
            zoom: 15,
            pitch: 60,
        },
        layers: [
            { id: '3dqr-anker', path: '/data/magdeburg/Buero_3DQR/1_anker.geojson', color: '#ff7f50' },
            { id: '3dqr-kontext', path: '/data/magdeburg/Buero_3DQR/2_kontext.geojson', color: '#6495ed' },
            { id: '3dqr-erzaehlung', path: '/data/magdeburg/Buero_3DQR/3_erzaehlung.geojson', color: '#ff69b4' },
        ]
    }
};