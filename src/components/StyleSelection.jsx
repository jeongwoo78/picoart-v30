// PicoArt v25 - StyleSelection (간소화: AI가 자동 선택)
import React, { useState } from 'react';
import { educationContent } from '../data/educationContent';

const StyleSelection = ({ onSelect }) => {
  const [mainCategory, setMainCategory] = useState('movements'); // movements, masters, oriental
  const [subCategory, setSubCategory] = useState('renaissance');

  // 스타일 카테고리 정의
  const styleCategories = {
    // 미술사조
    ancient: { name: '고대 미술', period: 'BC 800 - AD 500' },
    byzantineIslamic: { name: '비잔틴·이슬람', period: '4-14세기' },
    renaissance: { name: '르네상스', period: '14-16세기' },
    baroque: { name: '바로크', period: '17세기' },
    rococo: { name: '로코코', period: '18세기' },
    romanticism: { name: '낭만주의', period: '18세기 말-19세기' },
    impressionism: { name: '인상주의', period: '19세기 후반' },
    postImpressionism: { name: '후기인상주의', period: '1880-1900년대' },
    fauvism: { name: '야수파', period: '20세기 초' },
    expressionism: { name: '표현주의', period: '20세기 초' },
    
    // 거장 (대 카테고리와 소 카테고리 이름 통일)
    masters: { name: '거장', period: '시대를 초월한 거장들' },
    
    // 동양화 (대 카테고리와 소 카테고리 이름 통일)
    oriental: { name: '동양화', period: '한·중·일 전통' }
  };

  // 스타일 데이터 (AI가 자동 선택하므로 최소 정보만)
  const artStyles = [
    // 미술사조
    { id: 'ancient', name: '고대 미술', category: 'ancient', icon: '🏛️', description: '그리스·로마의 완벽한 균형미' },
    { id: 'byzantineIslamic', name: '비잔틴·이슬람', category: 'byzantineIslamic', icon: '🕌', description: '신성한 황금 모자이크' },
    { id: 'renaissance', name: '르네상스', category: 'renaissance', icon: '🎭', description: '인간 중심의 이상적 아름다움' },
    { id: 'baroque', name: '바로크', category: 'baroque', icon: '👑', description: '극적이고 웅장한 표현' },
    { id: 'rococo', name: '로코코', category: 'rococo', icon: '🌸', description: '우아하고 장식적인 취향' },
    { id: 'romanticism', name: '낭만주의', category: 'romanticism', icon: '🌊', description: '감정과 자연의 숭고함' },
    { id: 'impressionism', name: '인상주의', category: 'impressionism', icon: '🌅', description: '빛의 순간을 포착' },
    { id: 'postImpressionism', name: '후기인상주의', category: 'postImpressionism', icon: '🌻', description: '감정과 구조의 탐구' },
    { id: 'fauvism', name: '야수파', category: 'fauvism', icon: '🦁', description: '순수하고 강렬한 원색' },
    { id: 'expressionism', name: '표현주의', category: 'expressionism', icon: '😱', description: '내면의 불안과 고독' },
    
    // 거장
    { id: 'klimt-master', name: '구스타프 클림트', nameEn: 'Gustav Klimt', category: 'masters', icon: '✨', description: '금박과 장식의 화가' },
    { id: 'picasso-master', name: '파블로 피카소', nameEn: 'Pablo Picasso', category: 'masters', icon: '🎨', description: '입체주의의 창시자' },
    { id: 'vangogh-master', name: '빈센트 반 고흐', nameEn: 'Vincent van Gogh', category: 'masters', icon: '🌻', description: '격렬한 감정의 표현' },
    { id: 'matisse-master', name: '앙리 마티스', nameEn: 'Henri Matisse', category: 'masters', icon: '🎭', description: '색채의 마술사' },
    { id: 'munch-master', name: '에드바르 뭉크', nameEn: 'Edvard Munch', category: 'masters', icon: '😱', description: '불안과 고독의 화가' },
    { id: 'dali-master', name: '살바도르 달리', nameEn: 'Salvador Dalí', category: 'masters', icon: '⏰', description: '초현실주의의 거장' },
    
    // 동양화
    { id: 'korean', name: '한국 전통 회화', nameEn: 'Korean Art', category: 'oriental', icon: '🎎', description: '여백의 미와 절제미' },
    { id: 'chinese', name: '중국 전통 회화', nameEn: 'Chinese Art', category: 'oriental', icon: '🐉', description: '기운생동의 수묵화' },
    { id: 'japanese', name: '일본 전통 회화', nameEn: 'Japanese Art', category: 'oriental', icon: '🗾', description: '섬세한 관찰과 대담한 생략' }
  ];

  // 대 카테고리 정의
  const mainCategories = {
    movements: {
      name: '미술사조',
      icon: '🎨',
      description: '서양 미술의 흐름',
      subcategories: ['ancient', 'byzantineIslamic', 'renaissance', 'baroque', 'rococo', 'romanticism', 'impressionism', 'postImpressionism', 'fauvism', 'expressionism']
    },
    masters: {
      name: '거장 컬렉션',
      icon: '⭐',
      description: '시대를 대표하는 거장들',
      subcategories: ['masters']
    },
    oriental: {
      name: '동양화',
      icon: '🎎',
      description: '한·중·일 전통 미술',
      subcategories: ['oriental']
    }
  };

  // 카테고리별로 스타일 그룹화
  const groupedStyles = {};
  Object.keys(styleCategories).forEach(key => {
    groupedStyles[key] = {
      category: styleCategories[key],
      styles: artStyles.filter(style => style.category === key)
    };
  });

  // 현재 대 카테고리의 소 카테고리들
  const currentSubcategories = mainCategories[mainCategory].subcategories;

  // 소 카테고리별 스타일 수 계산
  const getCategoryCount = (categoryKey) => {
    return groupedStyles[categoryKey]?.styles.length || 0;
  };

  // 대 카테고리 변경 시 첫 번째 소 카테고리로 설정
  const handleMainCategoryChange = (newMainCategory) => {
    setMainCategory(newMainCategory);
    setSubCategory(mainCategories[newMainCategory].subcategories[0]);
  };

  // 미술사조 탭 클릭 시 바로 선택 처리
  const handleSubCategoryClick = (categoryKey) => {
    setSubCategory(categoryKey);
    
    // 미술사조(movements)인 경우 바로 선택
    if (mainCategory === 'movements') {
      const categoryStyles = groupedStyles[categoryKey]?.styles || [];
      if (categoryStyles.length > 0) {
        // 해당 카테고리의 첫 번째 스타일을 대표로 선택
        onSelect(categoryStyles[0]);
      }
    }
  };

  return (
    <div className="style-selection">
      <div className="selection-container">
        <div className="selection-header">
          <h1>🎨 화풍 선택</h1>
          <p className="header-subtitle">
            총 {artStyles.length}개의 화가와 스타일
          </p>
        </div>

        {/* 1단계: 대 카테고리 선택 */}
        <div className="main-category-nav">
          <div className="main-category-tabs">
            {Object.entries(mainCategories).map(([key, category]) => (
              <button
                key={key}
                className={`main-category-tab ${mainCategory === key ? 'active' : ''}`}
                onClick={() => handleMainCategoryChange(key)}
              >
                <span className="tab-icon">{category.icon}</span>
                <span className="tab-name">{category.name}</span>
                <span className="tab-desc">{category.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2단계: 소 카테고리 선택 (탭) */}
        <div className="sub-category-nav">
          <div className="sub-category-tabs">
            {currentSubcategories.map(key => {
              const category = styleCategories[key];
              if (!category) {
                console.error(`Category not found: ${key}`);
                return null;
              }
              return (
                <button
                  key={key}
                  className={`sub-category-tab ${subCategory === key ? 'active' : ''}`}
                  onClick={() => handleSubCategoryClick(key)}
                >
                  <span className="tab-name">{category.name}</span>
                  <span className="tab-period">{category.period}</span>
                  <span className="tab-count">{getCategoryCount(key)}개</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3단계: 개별 화가/스타일 선택 (거장과 동양화만 표시) */}
        {mainCategory !== 'movements' && (
          <div className="styles-section">
            {groupedStyles[subCategory] && (
              <>
                <div className="section-header">
                  <h2>{groupedStyles[subCategory].category.name}</h2>
                  <p className="section-period">
                    {groupedStyles[subCategory].category.period}
                  </p>
                </div>

                <div className="styles-grid">
                  {groupedStyles[subCategory].styles.map(style => (
                    <button
                      key={style.id}
                      className="style-card"
                      onClick={() => onSelect(style)}
                    >
                    <div className="card-icon">{style.icon}</div>
                    
                    <div className="card-content">
                      <div className="card-header">
                        <h3>{style.name}</h3>
                        <p className="card-english">{style.nameEn}</p>
                      </div>

                      {style.artist && (
                        <div className="artist-info">
                          <span className="artist-name">
                            {style.artist.name}
                          </span>
                          {style.artist.lifespan && (
                            <span className="artist-lifespan">
                              {style.artist.lifespan}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="card-description">{style.description}</p>

                      {style.model && (
                        <div className="model-badge">
                          {style.model === 'FLUX' ? '⚡ FLUX' : '🚀 SDXL'}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        )}
      </div>

      <style>{`
        .style-selection {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .selection-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .selection-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .selection-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
        }

        .header-subtitle {
          font-size: 1.1rem;
          opacity: 0.95;
          margin: 0;
        }

        /* 1단계: 대 카테고리 */
        .main-category-nav {
          margin-bottom: 1.5rem;
        }

        .main-category-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .main-category-tab {
          background: rgba(255, 255, 255, 0.15);
          border: 3px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 1.5rem 1rem;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
        }

        .main-category-tab:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .main-category-tab.active {
          background: rgba(255, 255, 255, 0.35);
          border-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .main-category-tab .tab-icon {
          font-size: 2.5rem;
        }

        .main-category-tab .tab-name {
          font-size: 1.3rem;
          font-weight: 700;
        }

        .main-category-tab .tab-desc {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        /* 2단계: 소 카테고리 */
        .sub-category-nav {
          margin-bottom: 2rem;
        }

        .sub-category-tabs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
        }

        .sub-category-tab {
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 1rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          backdrop-filter: blur(10px);
        }

        .sub-category-tab:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .sub-category-tab.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.7);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .sub-category-tab .tab-name {
          font-size: 1rem;
          font-weight: 600;
        }

        .sub-category-tab .tab-period {
          font-size: 0.75rem;
          opacity: 0.85;
        }

        .sub-category-tab .tab-count {
          font-size: 0.8rem;
          padding: 0.15rem 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          margin-top: 0.25rem;
        }

        /* 3단계: 화가 선택 */
        .styles-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #eee;
        }

        .section-header h2 {
          font-size: 1.8rem;
          color: #2d3748;
          margin: 0 0 0.5rem 0;
        }

        .section-period {
          font-size: 1rem;
          color: #718096;
          margin: 0;
        }

        .styles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .style-card {
          background: white;
          border: 2px solid #e2e8f0;
          padding: 1.5rem;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
        }

        .style-card:hover {
          border-color: #667eea;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
          transform: translateY(-4px);
        }

        .card-icon {
          font-size: 3rem;
          text-align: center;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .card-header h3 {
          font-size: 1.25rem;
          color: #2d3748;
          margin: 0;
        }

        .card-english {
          font-size: 0.85rem;
          color: #718096;
          margin: 0.25rem 0 0 0;
        }

        .artist-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem;
          background: #f7fafc;
          border-radius: 8px;
        }

        .artist-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #4a5568;
        }

        .artist-lifespan {
          font-size: 0.8rem;
          color: #a0aec0;
        }

        .card-description {
          font-size: 0.9rem;
          color: #4a5568;
          line-height: 1.5;
          margin: 0;
        }

        .model-badge {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          align-self: flex-start;
        }

        /* 모바일 반응형 */
        @media (max-width: 768px) {
          .style-selection {
            padding: 1rem;
          }

          .selection-header h1 {
            font-size: 2rem;
          }

          .header-subtitle {
            font-size: 1rem;
          }

          .main-category-tabs {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .main-category-tab {
            padding: 1.25rem;
          }

          .main-category-tab .tab-icon {
            font-size: 2rem;
          }

          .main-category-tab .tab-name {
            font-size: 1.1rem;
          }

          .sub-category-tabs {
            grid-template-columns: repeat(2, 1fr);
          }

          .styles-section {
            padding: 1.5rem;
          }

          .section-header h2 {
            font-size: 1.5rem;
          }

          .styles-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .style-card {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StyleSelection;
