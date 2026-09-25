// Tour stop photo registry. Generated from data/reference_photos/manifest.csv (source=user).
import type { CampusId } from '../../../shared/contracts';
// Regenerate with the association script after adding photos; unreferenced stops fall back to placeholders.
export interface TourPhoto {
  src: string;
  caption: string;
  creator?: string | null;
  license?: string | null;
  sourceUrl?: string | null;
  placeholder?: boolean;
}

const PHOTOS: Record<string, TourPhoto> = {
  'beiyangyuan-datong-center': { src: '/assets/campus/photos/beiyangyuan-datong-center-1.jpg', caption: '大通学生中心', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-dorm-cheng': { src: '/assets/campus/photos/beiyangyuan-dorm-cheng-1.jpg', caption: '诚园', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-dorm-ge': { src: '/assets/campus/photos/beiyangyuan-dorm-ge-1.jpg', caption: '格园', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-dorm-ping': { src: '/assets/campus/photos/beiyangyuan-dorm-ping-1.jpg', caption: '平园', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-dorm-qi': { src: '/assets/campus/photos/beiyangyuan-dorm-qi-1.jpg', caption: '齐园', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-dorm-xiu': { src: '/assets/campus/photos/beiyangyuan-dorm-xiu-1.jpg', caption: '修园', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-dorm-zheng': { src: '/assets/campus/photos/beiyangyuan-dorm-zheng-1.jpg', caption: '正园', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-dorm-zhi': { src: '/assets/campus/photos/beiyangyuan-dorm-zhi-1.jpg', caption: '知园', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-dorm-zhi-guo': { src: '/assets/campus/photos/beiyangyuan-dorm-zhi-guo-1.jpg', caption: '治园', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-earthquake-facility': { src: '/assets/campus/photos/beiyangyuan-earthquake-facility-1.jpg', caption: '国家大型地震工程模拟研究设施', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-east-gate': { src: '/assets/campus/photos/beiyangyuan-east-gate-1.jpg', caption: '北洋园校区东门', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-gaokao-wall': { src: '/assets/campus/photos/beiyangyuan-gaokao-wall-1.jpg', caption: '恢复高考纪念墙', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-gym': { src: '/assets/campus/photos/beiyangyuan-gym-1.jpg', caption: '综合体育馆', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-main-building': { src: '/assets/campus/photos/beiyangyuan-main-building-1.jpg', caption: '北洋园校区主楼', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-memorial-pavilion': { src: '/assets/campus/photos/beiyangyuan-memorial-pavilion-1.jpg', caption: '北洋纪念亭', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-motto-stone': { src: '/assets/campus/photos/beiyangyuan-motto-stone-1.jpg', caption: '实事求是校训石', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-qiushi-hall': { src: '/assets/campus/photos/beiyangyuan-qiushi-hall-1.jpg', caption: '求实会堂', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-sanwen-bridge': { src: '/assets/campus/photos/beiyangyuan-sanwen-bridge-1.jpg', caption: '三问桥', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-shangxian-stone': { src: '/assets/campus/photos/beiyangyuan-shangxian-stone-1.jpg', caption: '尚贤石', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-shutian-square': { src: '/assets/campus/photos/beiyangyuan-shutian-square-1.jpg', caption: '书田广场', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-suzhou-pavilion': { src: '/assets/campus/photos/beiyangyuan-suzhou-pavilion-1.jpg', caption: '苏州亭', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-tailei-square': { src: '/assets/campus/photos/beiyangyuan-tailei-square-1.jpg', caption: '太雷广场', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-tianlin-square': { src: '/assets/campus/photos/beiyangyuan-tianlin-square-1.jpg', caption: '天麟广场', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-tju-star': { src: '/assets/campus/photos/beiyangyuan-tju-star-1.jpg', caption: '天津大学星', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-xingsun-building': { src: '/assets/campus/photos/beiyangyuan-xingsun-building-1.jpg', caption: '杏荪楼', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-xuanhuai-square': { src: '/assets/campus/photos/beiyangyuan-xuanhuai-square-1.jpg', caption: '宣怀广场', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-xue-1-dining': { src: '/assets/campus/photos/beiyangyuan-xue-1-dining-1.jpg', caption: '学一食堂（梅园餐厅）', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-xue-2-dining': { src: '/assets/campus/photos/beiyangyuan-xue-2-dining-1.jpg', caption: '学二食堂（兰园餐厅）', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-xue-3-dining': { src: '/assets/campus/photos/beiyangyuan-xue-3-dining-1.jpg', caption: '学三食堂（棠园餐厅）', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-xue-4-dining': { src: '/assets/campus/photos/beiyangyuan-xue-4-dining-1.jpg', caption: '学四食堂（竹园餐厅）', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-xue-5-dining': { src: '/assets/campus/photos/beiyangyuan-xue-5-dining-1.jpg', caption: '学五食堂（桃园餐厅）', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-xue-6-dining': { src: '/assets/campus/photos/beiyangyuan-xue-6-dining-1.jpg', caption: '学六食堂（菊园餐厅）', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'beiyangyuan-zhengdong-library': { src: '/assets/campus/photos/beiyangyuan-zhengdong-library-1.jpg', caption: '郑东图书馆', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-newton-tree': { src: '/assets/campus/photos/weijinlu-newton-tree-1.jpg', caption: '牛顿苹果树', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-09-teaching': { src: '/assets/campus/photos/weijinlu-25-teaching-1.jpg', caption: '第九教学楼', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-25-teaching': { src: '/assets/campus/photos/weijinlu-25-teaching-1.jpg', caption: '曾宪梓楼（25教）', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-aiwan-lake': { src: '/assets/campus/photos/weijinlu-aiwan-lake-1.jpg', caption: '爱晚湖', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-alumni-home': { src: '/assets/campus/photos/weijinlu-alumni-home-1.jpg', caption: '校友之家', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-beiyang-square': { src: '/assets/campus/photos/weijinlu-beiyang-square-1.jpg', caption: '北洋广场', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-chunshui-library': { src: '/assets/campus/photos/weijinlu-chunshui-library-1.jpg', caption: '春水图书馆（北馆）', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-east-gate': { src: '/assets/campus/photos/weijinlu-east-gate-1.jpg', caption: '卫津路校区东门', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-feng-jicai': { src: '/assets/campus/photos/weijinlu-feng-jicai-1.jpg', caption: '冯骥才文学艺术研究院', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-history-museum': { src: '/assets/campus/photos/weijinlu-history-museum-1.jpg', caption: '天津大学校史博物馆', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-gym': { src: '/assets/campus/photos/beiyangyuan-gym-1.jpg', caption: '体育馆', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-haitang': { src: '/assets/campus/photos/weijinlu-feng-jicai-1.jpg', caption: '铭德道海棠', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-jingye-lake': { src: '/assets/campus/photos/weijinlu-jingye-lake-1.jpg', caption: '敬业湖', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-qiushi-pavilion': { src: '/assets/campus/photos/weijinlu-qiushi-pavilion-1.jpg', caption: '求是亭', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-science-library': { src: '/assets/campus/photos/weijinlu-science-library-1.jpg', caption: '科学图书馆（南馆）', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-stadium': { src: '/assets/campus/photos/weijinlu-stadium-1.jpg', caption: '体育场', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-swimming': { src: '/assets/campus/photos/beiyangyuan-gym-1.jpg', caption: '游泳馆', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-student-center': { src: '/assets/campus/photos/weijinlu-student-center-1.jpg', caption: '大学生活动中心', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-wang-xuezhong': { src: '/assets/campus/photos/weijinlu-wang-xuezhong-1.jpg', caption: '王学仲艺术研究所', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-water-building': { src: '/assets/campus/photos/beiyangyuan-earthquake-facility-1.jpg', caption: '水利馆', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-xue-4-dining': { src: '/assets/campus/photos/beiyangyuan-xue-4-dining-1.jpg', caption: '学四食堂', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-xue-5-dining': { src: '/assets/campus/photos/beiyangyuan-xue-5-dining-1.jpg', caption: '学五食堂', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-youth-lake': { src: '/assets/campus/photos/weijinlu-youth-lake-1.jpg', caption: '青年湖', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-youyi-lake': { src: '/assets/campus/photos/weijinlu-youyi-lake-1.jpg', caption: '友谊湖', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-zhang-tailei': { src: '/assets/campus/photos/weijinlu-zhang-tailei-1.jpg', caption: '张太雷像', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
  'weijinlu-dorm-san': { src: '/assets/campus/photos/beiyangyuan-dorm-cheng-1.jpg', caption: '三斋', creator: '用户提供', license: '本机导览使用', sourceUrl: null },
};

// Web assets use a stable `<poi>-N.jpg` sequence. Entries omitted here have one image.
// Reused point images inherit the complete source sequence while keeping the target caption.
const PHOTO_COUNTS: Record<string, number> = {
  'beiyangyuan-datong-center': 2,
  'beiyangyuan-earthquake-facility': 3,
  'beiyangyuan-east-gate': 2,
  'beiyangyuan-gaokao-wall': 2,
  'beiyangyuan-gym': 2,
  'beiyangyuan-main-building': 3,
  'beiyangyuan-memorial-pavilion': 2,
  'beiyangyuan-qiushi-hall': 3,
  'beiyangyuan-sanwen-bridge': 2,
  'beiyangyuan-shutian-square': 2,
  'beiyangyuan-suzhou-pavilion': 3,
  'beiyangyuan-tailei-square': 2,
  'beiyangyuan-tianlin-square': 2,
  'beiyangyuan-xingsun-building': 3,
  'beiyangyuan-xuanhuai-square': 2,
  'beiyangyuan-xue-1-dining': 2,
  'beiyangyuan-xue-2-dining': 2,
  'beiyangyuan-xue-3-dining': 3,
  'beiyangyuan-zhengdong-library': 3,
  'weijinlu-aiwan-lake': 2,
  'weijinlu-alumni-home': 2,
  'weijinlu-beiyang-square': 2,
  'weijinlu-chunshui-library': 2,
  'weijinlu-east-gate': 2,
  'weijinlu-feng-jicai': 2,
  'weijinlu-history-museum': 2,
  'weijinlu-newton-tree': 2,
  'weijinlu-qiushi-pavilion': 2,
  'weijinlu-science-library': 2,
  'weijinlu-stadium': 2,
  'weijinlu-student-center': 2,
  'weijinlu-youth-lake': 2,
  'weijinlu-youyi-lake': 2,
};

function placeholderImage(title: string): string {
  const safe = title.replace(/[<>&"']/g, '').slice(0, 24);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">`
    + `<rect width="640" height="400" fill="#e9f0ea"/>`
    + `<rect x="24" y="24" width="592" height="352" rx="16" fill="#f7faf7" stroke="#c9d8cc" stroke-dasharray="10 8"/>`
    + `<circle cx="320" cy="168" r="46" fill="none" stroke="#9db8a6" stroke-width="6"/>`
    + `<path d="M298 180l16-22 14 16 12-14 20 26z" fill="#9db8a6"/>`
    + `<circle cx="306" cy="152" r="7" fill="#9db8a6"/>`
    + `<text x="320" y="258" text-anchor="middle" font-family="Noto Sans SC, Microsoft YaHei, sans-serif" font-size="30" fill="#41604f">${safe}</text>`
    + `<text x="320" y="300" text-anchor="middle" font-family="Noto Sans SC, Microsoft YaHei, sans-serif" font-size="18" fill="#7d9486">实景图待补充 · 点击查看预留位</text>`
    + `</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function tourPhotoFor(poiId: string, title: string): TourPhoto {
  const photo = PHOTOS[poiId];
  if (photo && photo.src) return photo;
  return { src: placeholderImage(title), caption: title, placeholder: true };
}

export function tourPhotosFor(poiId: string, title: string): TourPhoto[] {
  const primary = tourPhotoFor(poiId, title);
  if (primary.placeholder) return [primary];
  const match = primary.src.match(/^(.*)-1\.jpg$/);
  if (!match) return [primary];
  const sourceId = match[1].split('/').at(-1) ?? '';
  const count = PHOTO_COUNTS[sourceId] ?? 1;
  return Array.from({length: count}, (_, index) => ({...primary, src: `${match[1]}-${index + 1}.jpg`}));
}

export function registeredPhotos(): Array<{ poiId: string; src: string; caption: string; campus: CampusId }> {
  return Object.entries(PHOTOS)
    .filter(([, photo]) => Boolean(photo.src))
    .map(([poiId, photo]) => ({ poiId, src: photo.src, caption: photo.caption, campus: poiId.startsWith('beiyangyuan-') ? 'beiyangyuan' : 'weijinlu' }));
}
