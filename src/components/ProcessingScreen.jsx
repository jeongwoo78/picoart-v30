// PicoArt v22 - ProcessingScreen (이중 교육 시스템)
// 변환 중: 사조/거장/동양화 설명
import React, { useEffect, useState } from 'react';
import { processStyleTransfer } from '../utils/styleTransferAPI';
import { educationContent } from '../data/educationContent';

const ProcessingScreen = ({ photo, selectedStyle, onComplete }) => {
  const [stage, setStage] = useState(1);
  const [statusText, setStatusText] = useState('준비 중...');
  const [showEducation, setShowEducation] = useState(false);
  const [aiArtistInfo, setAiArtistInfo] = useState(null);

  useEffect(() => {
    processImage();
  }, []);

  const processImage = async () => {
    try {
      // Stage 1: 사진 업로드 확인
      setStage(1);
      setStatusText('사진 준비 중...');
      await sleep(800);

      // Stage 2: 교육 컨텐츠 표시 시작
      setStage(2);
      const eduContent = getEducationContent();
      if (eduContent) {
        setStatusText(`${eduContent.title} 스타일 분석 중...`);
        setShowEducation(true);
        await sleep(1000);
      }

      // Stage 3: AI 변환 (교육 컨텐츠 계속 표시)
      setStage(3);
      setStatusText('AI가 사진을 분석하고 있습니다...');
      // 교육 컨텐츠는 계속 표시됨 (setShowEducation(false) 제거)
      await sleep(500);
      
      setStatusText('AI가 최적의 화가를 선택하고 있습니다...');
      await sleep(500);

      // Get API key
      const apiKey = import.meta.env.VITE_REPLICATE_API_KEY;

      // Process with progress callback
      const result = await processStyleTransfer(
        photo,
        selectedStyle,
        apiKey,
        (progressText) => setStatusText(progressText)
      );

      if (!result.success) {
        throw new Error(result.error || 'Style transfer failed');
      }

      // AI 선택 정보 저장
      if (result.aiSelectedArtist) {
        setAiArtistInfo({
          artist: result.aiSelectedArtist,
          method: result.selectionMethod,
          details: result.selectionDetails
        });
        setStatusText(`${result.aiSelectedArtist} 화풍으로 변환 완료!`);
        await sleep(1000);
      }

      // Stage 4: Complete
      setStage(4);
      setShowEducation(false); // 완료 시점에 교육 종료
      setStatusText('완성되었습니다!');
      await sleep(500);

      // AI 선택 정보와 함께 완료
      onComplete(selectedStyle, result.resultUrl, result);

    } catch (error) {
      console.error('Processing error:', error);
      setStatusText(`오류: ${error.message || '다시 시도해주세요.'}`);
    }
  };

  // 변환 중 교육 컨텐츠 가져오기
  const getEducationContent = () => {
    const category = selectedStyle.category;
    
    // 1. 사조 탭 → 사조 설명
    if (category !== 'masters' && category !== 'oriental') {
      return educationContent.movements[category];
    }
    
    // 2. 거장 탭 → 거장 소개 (educationContent에서 가져오기)
    if (category === 'masters') {
      const masterId = selectedStyle.id; // '-master' 그대로 사용!
      const masterInfo = educationContent.masters[masterId];
      
      if (masterInfo) {
        return {
          title: masterInfo.title,
          desc: masterInfo.desc
        };
      }
      
      // Fallback
      return {
        title: selectedStyle.name || '거장',
        desc: '선택하신 거장의 화풍으로 변환합니다.'
      };
    }
    
    // 3. 동양화 탭 → 동양화 전통 설명 (educationContent.oriental에서 가져오기)
    if (category === 'oriental') {
      const styleId = selectedStyle.id; // 'korean', 'chinese', 'japanese'
      const orientalInfo = educationContent.oriental[styleId];
      
      if (orientalInfo) {
        return {
          title: orientalInfo.title,
          desc: orientalInfo.desc
        };
      }
      
      // Fallback (혹시 못 찾을 경우)
      return {
        title: selectedStyle.name || '동양화',
        desc: '선택하신 동양화 스타일로 변환합니다.'
      };
    }

    return null;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="processing-screen">
      <div className="processing-content">
        <h2>🎨 변환 중</h2>

        {/* Progress stages */}
        <div className="progress-stages">
          <div className={`stage ${stage >= 1 ? 'active' : ''} ${stage > 1 ? 'complete' : ''}`}>
            <span className="stage-number">1</span>
            <span className="stage-label">준비</span>
          </div>
          <div className={`stage ${stage >= 2 ? 'active' : ''} ${stage > 2 ? 'complete' : ''}`}>
            <span className="stage-number">2</span>
            <span className="stage-label">스타일 설명</span>
          </div>
          <div className={`stage ${stage >= 3 ? 'active' : ''} ${stage > 3 ? 'complete' : ''}`}>
            <span className="stage-number">3</span>
            <span className="stage-label">AI 변환</span>
          </div>
          <div className={`stage ${stage >= 4 ? 'active' : ''}`}>
            <span className="stage-number">4</span>
            <span className="stage-label">완성</span>
          </div>
        </div>

        {/* Status text */}
        <p className="status-text">{statusText}</p>

        {/* Loading animation */}
        <div className="loading-animation">
          <div className="spinner"></div>
        </div>

        {/* 교육 컨텐츠 - 변환 중 */}
        {showEducation && (
          <div className="education-content">
            <div className="education-header">
              <div className="education-icon">{selectedStyle.icon || '🎨'}</div>
              <h3>{getEducationContent()?.title}</h3>
            </div>
            <div className="education-body">
              <p className="education-desc">{getEducationContent()?.desc}</p>
              
              {/* AI 선택 화가 정보 */}
              {aiArtistInfo && (
                <div className="ai-artist-info">
                  <div className="ai-badge">✨ AI 추천</div>
                  <p className="ai-artist-name">
                    <strong>{aiArtistInfo.artist}</strong>
                  </p>
                  {aiArtistInfo.details?.reason && (
                    <p className="ai-reason">
                      {aiArtistInfo.details.reason}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <p className="processing-note">
          고품질 변환을 위해 {selectedStyle?.model === 'FLUX' ? '50-60초' : '30-40초'} 정도 소요됩니다.
          {selectedStyle?.model === 'FLUX' && ' (FLUX 최고 품질 모드)'}
        </p>
      </div>

      <style>{`
        .processing-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .processing-content {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .processing-content h2 {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
          font-size: 2rem;
        }

        .progress-stages {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          position: relative;
        }

        .progress-stages::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e0e0e0;
          z-index: 0;
        }

        .stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 1;
          position: relative;
        }

        .stage-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e0e0e0;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.3s;
        }

        .stage.active .stage-number {
          background: #667eea;
          color: white;
          animation: pulse 2s infinite;
        }

        .stage.complete .stage-number {
          background: #10b981;
          color: white;
        }

        .stage-label {
          font-size: 0.85rem;
          color: #666;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .status-text {
          text-align: center;
          color: #667eea;
          font-size: 1.1rem;
          margin: 1.5rem 0;
          min-height: 1.5rem;
        }

        .loading-animation {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* 교육 컨텐츠 - 변환 중 */
        .education-content {
          background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
          border-radius: 15px;
          padding: 2rem;
          margin: 1.5rem 0;
          animation: fadeIn 0.5s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .education-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #dee2e6;
        }

        .education-icon {
          font-size: 3rem;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
        }

        .education-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.5rem;
        }

        .education-body {
          color: #555;
        }

        .education-desc {
          line-height: 1.8;
          font-size: 1rem;
          margin: 0;
          white-space: pre-line; /* \n을 줄바꿈으로 표시 */
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .education-desc::-webkit-scrollbar {
          width: 6px;
        }

        .education-desc::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .education-desc::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .education-desc::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* AI 선택 화가 정보 */
        .ai-artist-info {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px dashed #dee2e6;
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateX(-20px);
          }
          to { 
            opacity: 1; 
            transform: translateX(0);
          }
        }

        .ai-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: bold;
          margin-bottom: 0.8rem;
        }

        .ai-artist-name {
          font-size: 1.2rem;
          color: #333;
          margin: 0.5rem 0;
        }

        .ai-artist-name strong {
          color: #667eea;
        }

        .ai-reason {
          font-size: 0.95rem;
          color: #666;
          font-style: italic;
          line-height: 1.6;
          margin: 0.5rem 0 0 0;
        }

        .processing-note {
          text-align: center;
          color: #999;
          font-size: 0.9rem;
          margin-top: 2rem;
        }

        @media (max-width: 640px) {
          .processing-content {
            padding: 2rem 1.5rem;
          }

          .progress-stages {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .stage-number {
            width: 35px;
            height: 35px;
            font-size: 0.9rem;
          }

          .stage-label {
            font-size: 0.75rem;
          }

          .education-icon {
            font-size: 2.5rem;
          }

          .education-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
