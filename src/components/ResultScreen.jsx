// PicoArt v30 - ResultScreen
// 동양화 6개 장르 지원 + 디버깅 로그 강화
// 2025-11-11 최종 버전

import React, { useState, useEffect } from 'react';
import BeforeAfter from './BeforeAfter';
import { orientalEducation } from '../data/educationContent';


const ResultScreen = ({ 
  originalPhoto, 
  resultImage, 
  selectedStyle, 
  aiSelectedArtist, 
  onReset 
}) => {
  
  // ========== State ==========
  const [showInfo, setShowInfo] = useState(true);
  const [educationText, setEducationText] = useState('');
  const [isLoadingEducation, setIsLoadingEducation] = useState(true);


  // ========== Effects ==========
  // aiSelectedArtist가 변경될 때마다 2차 교육 재생성
  useEffect(() => {
    console.log('🎨 ResultScreen mounted or aiSelectedArtist changed');
    generate2ndEducation();
  }, [aiSelectedArtist]);


  // ========== 2차 교육 생성 ==========
  const generate2ndEducation = async () => {
    try {
      setIsLoadingEducation(true);
      
      // 동양화는 미리 작성된 콘텐츠 사용 (AI 호출 없음)
      if (selectedStyle.category === 'oriental') {
        console.log('📜 Loading pre-written oriental education...');
        const content = getOrientalEducation();
        
        if (content) {
          setEducationText(content);
          setIsLoadingEducation(false);
          return;
        }
      }
      
      // 미술사조/거장은 AI로 생성
      console.log('🤖 Generating AI education...');
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
        console.log('✅ AI education generated successfully');
        setEducationText(data.text);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      console.error('❌ 2nd education generation failed:', error);
      setEducationText(getFallbackMessage());
    } finally {
      setIsLoadingEducation(false);
    }
  };


  // ========== 동양화 교육 콘텐츠 (v30) ==========
  const getOrientalEducation = () => {
    const styleId = selectedStyle.id;
    
    console.log('');
    console.log('========================================');
    console.log('🔍 ORIENTAL EDUCATION DEBUG (v30)');
    console.log('========================================');
    console.log('📌 selectedStyle.id:', styleId);
    console.log('📌 aiSelectedArtist:', aiSelectedArtist);
    console.log('📌 aiSelectedArtist type:', typeof aiSelectedArtist);
    console.log('========================================');
    console.log('');
    
    
    // ========== 한국 전통 회화 (3가지) ==========
    if (styleId === 'korean') {
      const genre = aiSelectedArtist?.toLowerCase() || '';
      console.log('🇰🇷 KOREAN ART DETECTION:');
      console.log('   - genre string:', genre);
      console.log('');
      
      // 민화
      if (genre.includes('minhwa') || genre.includes('민화')) {
        console.log('✅ MATCH: Korean Minhwa (민화)');
        console.log('========================================');
        console.log('');
        return orientalEducation.korean_minhwa?.description 
            || orientalEducation.korean?.description;
      } 
      
      // 풍속화
      else if (genre.includes('genre') || genre.includes('풍속') || genre.includes('pungsokdo') || genre.includes('풍속도')) {
        console.log('✅ MATCH: Korean Genre Painting (풍속화)');
        console.log('========================================');
        console.log('');
        return orientalEducation.korean_genre?.description 
            || orientalEducation.korean?.description;
      } 
      
      // 진경산수화
      else if (genre.includes('jingyeong') || genre.includes('진경') || genre.includes('landscape')) {
        console.log('✅ MATCH: Korean True-View Landscape (진경산수화)');
        console.log('========================================');
        console.log('');
        return orientalEducation.korean_jingyeong?.description 
            || orientalEducation.korean_default?.description;
      }
      
      // 기본값 (매칭 실패시)
      else {
        console.log('⚠️ DEFAULT: Korean Traditional Painting (한국 전통 회화)');
        console.log('========================================');
        console.log('');
        return orientalEducation.korean_default?.description;
      }
    }
    
    
    // ========== 중국 전통 회화 (3가지) ==========
    if (styleId === 'chinese') {
      const artist = aiSelectedArtist?.toLowerCase() || '';
      console.log('🇨🇳 CHINESE ART DETECTION:');
      console.log('   - artist string:', artist);
      console.log('');
      
      // 공필화
      if (artist.includes('gongbi') || artist.includes('공필')) {
        console.log('✅ MATCH: Chinese Gongbi (工筆畫)');
        console.log('========================================');
        console.log('');
        return orientalEducation.chinese_gongbi?.description 
            || orientalEducation.chinese_ink?.description;
      } 
      
      // 화조화
      else if (artist.includes('huaniao') || artist.includes('화조') || artist.includes('flower') || artist.includes('bird')) {
        console.log('✅ MATCH: Chinese Huaniao (花鳥畫)');
        console.log('========================================');
        console.log('');
        return orientalEducation.chinese_huaniao?.description 
            || orientalEducation.chinese_default?.description;
      }
      
      // 수묵화
      else if (artist.includes('ink') || artist.includes('수묵') || artist.includes('wash')) {
        console.log('✅ MATCH: Chinese Ink Wash (水墨畫)');
        console.log('========================================');
        console.log('');
        return orientalEducation.chinese_ink?.description 
            || orientalEducation.chinese_default?.description;
      }
      
      // 기본값 (매칭 실패시)
      else {
        console.log('⚠️ DEFAULT: Chinese Traditional Painting (중국 전통 회화)');
        console.log('========================================');
        console.log('');
        return orientalEducation.chinese_default?.description;
      }
    }
    
    
    // ========== 일본 전통 회화 (1가지) ==========
    if (styleId === 'japanese') {
      console.log('🇯🇵 JAPANESE ART DETECTION:');
      console.log('✅ MATCH: Japanese Ukiyo-e (浮世繪)');
      console.log('========================================');
      console.log('');
      return orientalEducation.japanese_ukiyoe?.description 
          || orientalEducation.japanese_default?.description;
    }
    
    
    console.log('⚠️ NO MATCH - Returning null');
    console.log('========================================');
    console.log('');
    return null;
  };


  // ========== 프롬프트 생성 (미술사조/거장) ==========
  const buildPrompt = () => {
    const category = selectedStyle.category;
    
    // 고대 미술, 비잔틴·이슬람
    if (category === 'ancient' || category === 'byzantineIslamic') {
      return `당신은 미술사 전문가입니다.
사용자가 선택한 미술사조는 "${selectedStyle.name}"입니다.

고대 미술과 비잔틴·이슬람 미술은 특정 화가가 아닌 시대와 양식으로 정의됩니다.

다음 형식으로 정확히 3-4문장으로 작성하세요:

1문장: "당신의 사진에는 ${selectedStyle.name}의 {대표 기법명과 특징} 기법이 적용되었습니다."
2문장: "${selectedStyle.name}은 {시대 범위}의 {문화권} 미술로, {핵심 특징과 추구한 가치를 상세히} 설명."
3문장: "대표 유물로는 {유물1}, {유물2}, {유물3} 등이 있으며, {유물들의 공통 의미를 한 문장으로}."
4문장(선택): "{현대에 미친 영향이나 당신 사진과의 연결을 한 문장으로}"`;
    }
    
    // 미술사조 (특정 화가 있음)
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
4문장(선택): "{화가의 인상적인 일화나 영향, 또는 당신 사진과의 연결을 한 문장으로}"`;
    }
    
    // 거장
    if (category === 'masters') {
      return `당신은 미술사 전문가입니다.
사용자가 선택한 거장은 "${selectedStyle.name}"입니다.

다음 형식으로 정확히 3-4문장으로 작성하세요:

1문장: "당신의 사진에는 {화가명}의 {특정 시기나 스타일의} {구체적 기법명} 기법이 적용되었습니다."
2문장: "{화가명}({생몰연도})은 {국적} 출신 {화풍} 화가로, {핵심 특징과 예술적 추구를 상세히} 설명."
3문장: "대표작으로는 "{작품1}", "{작품2}", "{작품3}" 등이 있으며, {작품들의 특징을 한 문장으로}."
4문장(선택): "{화가의 인상적인 일화나 당신 사진과의 연결을 한 문장으로}"`;
    }
    
    return '';
  };


  // ========== Fallback 메시지 ==========
  const getFallbackMessage = () => {
    return `이 작품은 ${selectedStyle.name} 스타일로 변환되었습니다.`;
  };


  // ========== 다운로드 ==========
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


  // ========== 공유 ==========
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


  // ========== Render ==========
  return (
    <div className="result-screen">
      <div className="result-container">
        
        {/* Header */}
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

        {/* Toggle Button */}
        <div className="info-toggle">
          <button 
            className="toggle-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? '🔽 작품 설명 숨기기' : '🔼 작품 설명 보기'}
          </button>
        </div>

        {/* Education Card */}
        {showInfo && (
          <div className="technique-card">
            
            {/* Card Header */}
            <div className="card-header">
              <div className="technique-icon">
                {selectedStyle.icon || '🎨'}
              </div>
              <div>
                <h2>{selectedStyle.name}</h2>
                <p className="technique-subtitle">
                  {aiSelectedArtist || '예술 스타일'}
                </p>
              </div>
            </div>

            {/* Card Content */}
            <div className="card-content">
              {isLoadingEducation ? (
                <div className="loading-education">
                  <div className="spinner"></div>
                  <p>작품 설명을 생성하고 있습니다...</p>
                </div>
              ) : (
                <div className="technique-explanation">
                  <h3>🖌️ 적용된 예술 기법</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>
                    {educationText}
                  </p>
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-download" 
            onClick={handleDownload}
          >
            <span className="btn-icon">📥</span>
            다운로드
          </button>
          
          <button 
            className="btn btn-share" 
            onClick={handleShare}
          >
            <span className="btn-icon">🔗</span>
            공유하기
          </button>
          
          <button 
            className="btn btn-reset" 
            onClick={onReset}
          >
            <span className="btn-icon">🔄</span>
            다시 만들기
          </button>
        </div>
        
      </div>

      {/* Styles */}
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
