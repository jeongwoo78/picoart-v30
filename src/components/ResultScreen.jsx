// PicoArt v25 - ResultScreen (단순화된 동양화 교육)
// 결과물: 미리 작성된 동양화 설명 + AI 생성 미술사조/거장 설명
import React, { useState, useEffect } from 'react';
import BeforeAfter from './BeforeAfter';
import { orientalEducation } from '../data/educationContent';

const ResultScreen = ({ originalPhoto, resultImage, selectedStyle, aiSelectedArtist, onReset }) => {
  const [showInfo, setShowInfo] = useState(true);
  const [educationText, setEducationText] = useState('');
  const [isLoadingEducation, setIsLoadingEducation] = useState(true);

  // 2차 교육 생성
  useEffect(() => {
    generate2ndEducation();
  }, []);

  const generate2ndEducation = async () => {
    try {
      setIsLoadingEducation(true);
      
      // 동양화는 미리 작성된 콘텐츠 사용 (AI 호출 없음)
      if (selectedStyle.category === 'oriental') {
        const content = getOrientalEducation();
        if (content) {
          setEducationText(content);
          setIsLoadingEducation(false);
          return;
        }
      }
      
      // 미술사조/거장만 AI 생성
      const prompt = buildPrompt();
      
      // 백엔드 API 호출
      const response = await fetch('/api/generate-education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.text) {
        setEducationText(data.text);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      console.error('2nd education generation failed:', error);
      // Fallback 메시지
      setEducationText(getFallbackMessage());
    } finally {
      setIsLoadingEducation(false);
    }
  };

  // 동양화 교육 콘텐츠 가져오기 (미리 작성된 것)
  const getOrientalEducation = () => {
    const styleId = selectedStyle.id;
    
    // 한국 - 민화 (고정)
    if (styleId === 'korean') {
      return orientalEducation.korean.description;
    }
    
    // 중국 - AI 선택 결과에 따라 수묵화/공필화
    if (styleId === 'chinese') {
      // aiSelectedArtist에서 스타일 판단
      const artist = aiSelectedArtist?.toLowerCase() || '';
      
      if (artist.includes('gongbi') || artist.includes('공필')) {
        return orientalEducation.chinese_gongbi.description;
      } else {
        // 기본은 수묵화
        return orientalEducation.chinese_ink.description;
      }
    }
    
    // 일본 - 우키요에 (고정)
    if (styleId === 'japanese') {
      return orientalEducation.japanese.description;
    }
    
    return null;
  };

  // 카테고리별 프롬프트 생성
  const buildPrompt = () => {
    const category = selectedStyle.category;
    
    // 고대 미술, 비잔틴·이슬람 (특정 화가 없음 - 양식/시대로 설명)
    if (category === 'ancient' || category === 'byzantineIslamic') {
      return `당신은 미술사 전문가입니다.
사용자가 선택한 미술사조는 "${selectedStyle.name}"입니다.

고대 미술과 비잔틴·이슬람 미술은 특정 화가가 아닌 시대와 양식으로 정의됩니다.

다음 형식으로 정확히 3-4문장으로 작성하세요:

1문장: "당신의 사진에는 ${selectedStyle.name}의 {대표 기법명과 특징} 기법이 적용되었습니다."
2문장: "${selectedStyle.name}은 {시대 범위}의 {문화권} 미술로, {핵심 특징과 추구한 가치를 상세히} 설명."
3문장: "대표 유물로는 {유물1}, {유물2}, {유물3} 등이 있으며, {유물들의 공통 의미를 한 문장으로}."
4문장(선택): "{현대에 미친 영향이나 당신 사진과의 연결을 한 문장으로}"

예시 (비잔틴·이슬람):
당신의 사진에는 비잔틴·이슬람 미술의 황금 모자이크와 
기하학적 아라베스크 문양 기법이 적용되었습니다.

비잔틴·이슬람 미술은 AD 400-1400년의 동로마 제국과 이슬람 문화권 미술로, 
황금빛으로 빛나는 모자이크와 무한히 반복되는 기하학 패턴을 통해
신성함과 영원함을 표현하는 것이 특징입니다.

대표 유물로는 하기아 소피아의 모자이크, 알함브라 궁전의 아라베스크, 
바위의 돔의 황금 장식 등이 있으며, 이들은 모두 인간이 신성에 다가가려는 
영적 열망을 담고 있습니다.

천년이 지난 지금도 그 황금빛이 바래지 않듯, 당신의 사진 역시 
시간을 초월한 아름다움으로 빛나고 있습니다.`;
    }
    
    // 나머지 미술사조 (특정 화가 있음)
    if (category === 'impressionism' || category === 'postImpressionism' || 
        category === 'fauvism' || category === 'expressionism' || 
        category === 'renaissance' || category === 'baroque' || 
        category === 'rococo' || category === 'romanticism') {
      return `당신은 미술사 전문가입니다.
사용자가 선택한 미술사조는 "${selectedStyle.name}"이고, 
당신이 선택한 화가는 "${aiSelectedArtist || selectedStyle.name}"입니다.

다음 형식으로 정확히 3-4문장으로 작성하세요:

1문장: "당신의 사진에는 {화가명}의 {대표 기법명} 기법이 적용되었습니다."
2문장: "{화가명}({생몰연도})은 {국적} 출신 {화풍} 화가로, {핵심 특징 상세 설명}이 특징입니다."
3문장: "대표작으로는 "{작품1}", "{작품2}", "{작품3}" 등이 있으며, {작품들의 공통점이나 화가의 예술 철학 한 줄}."
4문장(선택): "{화가의 인상적인 일화나 영향, 또는 당신 사진과의 연결을 한 문장으로}"

예시:
당신의 사진에는 클로드 모네의 보색 대비와 색채 분할 기법이 적용되었습니다.

클로드 모네(1840-1926)는 프랑스 출신 인상주의의 창시자로, 
같은 장소를 서로 다른 시간대에 반복해서 그리며 빛의 순간적 변화를 
포착하는 것이 특징입니다.

대표작으로는 수련 연작 40여 점, 루앙 대성당 연작, "인상, 해돋이" 등이 있으며,
모두 빛과 시간의 흐름을 담아내려는 평생의 탐구를 보여줍니다.

시력을 잃어가면서도 "빛과 색채 속에서 사라지고 싶다"고 말했던 그의 열정이
당신의 사진에도 담겨 있습니다.`;
    }
    
    // 거장
    if (category === 'masters') {
      return `당신은 미술사 전문가입니다.
사용자가 선택한 거장은 "${selectedStyle.name}"입니다.

다음 형식으로 정확히 3-4문장으로 작성하세요:

1문장: "당신의 사진에는 {화가명}의 {특정 시기나 스타일의} {구체적 기법명} 기법이 적용되었습니다."
2문장: "{화가명}({생몰연도})은 {국적} 출신 {화풍} 화가로, {핵심 특징과 예술적 추구를 상세히} 설명."
3문장: "대표작으로는 "{작품1}", "{작품2}", "{작품3}" 등이 있으며, {작품들의 특징을 한 문장으로}."
4문장(선택): "{화가의 인상적인 일화나 당신 사진과의 연결을 한 문장으로}"

예시:
당신의 사진에는 빈센트 반 고흐의 아를 시대 임파스토와 
소용돌이치는 붓터치 기법이 적용되었습니다.

빈센트 반 고흐(1853-1890)는 네덜란드 출신 후기인상주의 화가로, 
물감을 두껍게 쌓아올리고 격렬한 붓질로 내면의 감정을 
직접적으로 표현하는 것이 특징입니다.

대표작으로는 소용돌이치는 "별이 빛나는 밤", 타오르는 "해바라기" 연작,
불안한 "까마귀가 나는 밀밭" 등이 있으며, 모두 그의 뜨거운 감정이 
붓끝을 통해 폭발하듯 쏟아져 나온 작품들입니다.

"나는 별이 되고 싶다"고 썼던 그의 꿈이 당신의 사진 속에서 빛나고 있습니다.`;
    }
    
    // 동양화는 미리 작성된 콘텐츠 사용 (이 함수 호출 안 됨)
    // getOrientalEducation()에서 처리
    
    return '';
  };

  // Fallback 메시지
  const getFallbackMessage = () => {
    return `이 작품은 ${selectedStyle.name} 스타일로 변환되었습니다.`;
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `picoart-${selectedStyle.id}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PicoArt - AI 예술 변환',
          text: `${selectedStyle.name}로 변환한 작품`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="result-screen">
      <div className="result-container">
        <div className="result-header">
          <h1>✨ 완성!</h1>
          <p className="result-subtitle">
            {selectedStyle.name} 스타일로 변환되었습니다
          </p>
        </div>

        {/* Before/After Slider */}
        <div className="comparison-wrapper">
          <BeforeAfter 
            beforeImage={URL.createObjectURL(originalPhoto)}
            afterImage={resultImage}
          />
        </div>

        {/* 화법 설명 Toggle */}
        <div className="info-toggle">
          <button 
            className="toggle-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? '🔽 작품 설명 숨기기' : '🔼 작품 설명 보기'}
          </button>
        </div>

        {/* 화법 설명 카드 */}
        {showInfo && (
          <div className="technique-card">
            <div className="card-header">
              <div className="technique-icon">{selectedStyle.icon || '🎨'}</div>
              <div>
                <h2>{selectedStyle.name}</h2>
                <p className="technique-subtitle">{aiSelectedArtist || '예술 스타일'}</p>
              </div>
            </div>

            <div className="card-content">
              {isLoadingEducation ? (
                <div className="loading-education">
                  <div className="spinner"></div>
                  <p>작품 설명을 생성하고 있습니다...</p>
                </div>
              ) : (
                <div className="technique-explanation">
                  <h3>🖌️ 적용된 예술 기법</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{educationText}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-download" onClick={handleDownload}>
            <span className="btn-icon">📥</span>
            다운로드
          </button>
          <button className="btn btn-share" onClick={handleShare}>
            <span className="btn-icon">🔗</span>
            공유하기
          </button>
          <button className="btn btn-reset" onClick={onReset}>
            <span className="btn-icon">🔄</span>
            다시 만들기
          </button>
        </div>
      </div>

      <style>{`
        .result-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-container {
          max-width: 900px;
          width: 100%;
        }

        .result-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .result-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
        }

        .result-subtitle {
          font-size: 1.1rem;
          opacity: 0.95;
          margin: 0;
        }

        .comparison-wrapper {
          background: white;
          padding: 1.5rem;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
        }

        .info-toggle {
          text-align: center;
          margin-bottom: 1rem;
        }

        .toggle-button {
          background: rgba(255,255,255,0.2);
          border: 2px solid white;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .toggle-button:hover {
          background: white;
          color: #667eea;
        }

        .technique-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e0e0e0;
          margin-bottom: 1.5rem;
        }

        .technique-icon {
          font-size: 4rem;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
        }

        .card-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.75rem;
        }

        .technique-subtitle {
          color: #666;
          font-size: 0.95rem;
          margin: 0.25rem 0 0 0;
        }

        .loading-education {
          text-align: center;
          padding: 3rem 2rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-education p {
          color: #666;
          font-size: 1rem;
        }

        .technique-explanation {
          background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
          padding: 1.5rem;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .technique-explanation h3 {
          color: #667eea;
          font-size: 1.1rem;
          margin: 0 0 1rem 0;
        }

        .technique-explanation p {
          color: #333;
          line-height: 1.8;
          font-size: 1rem;
          margin: 0;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .btn {
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        .btn-download {
          background: #10b981;
          color: white;
        }

        .btn-download:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
        }

        .btn-share {
          background: #3b82f6;
          color: white;
        }

        .btn-share:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .btn-reset {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-reset:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 768px) {
          .result-screen {
            padding: 1rem;
          }

          .result-header h1 {
            font-size: 2rem;
          }

          .result-subtitle {
            font-size: 0.95rem;
          }

          .comparison-wrapper {
            padding: 1rem;
          }

          .technique-card {
            padding: 1.5rem;
          }

          .technique-icon {
            font-size: 3rem;
          }

          .card-header h2 {
            font-size: 1.5rem;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultScreen;
