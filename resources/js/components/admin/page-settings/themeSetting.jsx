// import { Card } from 'antd';
// import React, { useState, useRef, useEffect } from 'react';
// import { useI18n } from '../../../providers/i18n';
// import { fetchSiteSettings, updateTheme } from '../../../helpers/backend';
// import { useActionConfirm, useFetch } from '../../../helpers/hooks';
// import FormButton from '../../common/form/form-button';

// const ThemeSetting = () => {
//     const i18n = useI18n();
//     const [settingData, setSettingData] = useFetch(fetchSiteSettings)

//     const [hoveredIndex, setHoveredIndex] = useState(null);
//     const imageRefs = useRef([]);
//     useEffect(() => {
//         if (hoveredIndex !== null) {
//             const img = imageRefs.current[hoveredIndex];
//             let scrollAmount = 0;
//             const scrollSpeed = 5;

//             const scrollInterval = setInterval(() => {
//                 scrollAmount += scrollSpeed;
//                 if (scrollAmount >= img.scrollHeight - img.clientHeight) {
//                     clearInterval(scrollInterval);
//                 } else {
//                     img.scrollTop = scrollAmount;
//                 }
//             }, 20);

//             return () => clearInterval(scrollInterval);
//         }
//     }, [hoveredIndex]);

//     const allThemes = [
//         {
//             name: 'theme1',
//             image: layout1
//         },
//         {
//             name: 'theme2',
//             image: layout2
//         },
//         {
//             name: 'theme3',
//             image: layout3
//         }
//     ]

//     return (
//         <div className="space-y-4">
//             <Card>
//                 <h6 className="py-2 text-lg text-secondary">{i18n?.t('Theme Setting')}</h6>
//             </Card>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
//                 {allThemes?.map((theme, index) => (
//                     <div key={index} className="relative overflow-auto transition-shadow duration-100 rounded-lg cursor-pointer group hover:shadow-lg ">
//                         <div
//                             className="h-[500px] relative overflow-hidden"
//                             onMouseEnter={() => setHoveredIndex(index)}
//                             onMouseLeave={() => setHoveredIndex(null)}
//                         >
//                             <div
//                                 ref={el => imageRefs.current[index] = el}
//                                 className="absolute inset-0 overflow-y-scroll hide-scrollbar scrollbar-hide"
//                             >
//                                 <img
//                                     src={theme?.name=='theme1' ? layout1 : theme?.name=='theme2' ? layout2 : layout3}
//                                     alt={`ThemePreview ${index + 1}`}
//                                     width={500}
//                                     height={2000}
//                                     className="object-cover w-full"
//                                 />
//                             </div>
//                         </div>
//                         <div className="p-6 bg-white">
//                             <FormButton
//                             type='submit'
//                             className={settingData?.theme === theme?.name ? 'bg-primary text-white' : 'bg-white text-primary'}
//                             onClick={() => {
//                                 useActionConfirm(updateTheme, {theme : theme?.name},setSettingData,  'Are you sure you want to activate this theme?')

//                             }}
//                             >{i18n?.t(settingData?.theme === theme?.name ? 'Activated': 'Activate')}</FormButton>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ThemeSetting;
