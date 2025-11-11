// PicoArt v31 - 교육 콘텐츠 통합 (3개 파일로 분리)

// 3개 파일로 분리:
// 1. movementsEducation.js - 서양 미술 9개 사조
// 2. mastersEducation.js - 서양 거장 6명
// 3. orientalEducation.js - 동양화 6개 장르

import { movementsEducation } from './movementsEducation';
import { mastersEducation } from './mastersEducation';
import { orientalOverview, orientalEducation } from './orientalEducation';

// 기존 구조 유지 (하위 호환성)
export const educationContent = {
  movements: movementsEducation,
  masters: mastersEducation,
  oriental: orientalOverview
};

// 동양화는 별도 export
export { orientalEducation };

// 개별 export (필요시)
export { movementsEducation, mastersEducation, orientalOverview };
