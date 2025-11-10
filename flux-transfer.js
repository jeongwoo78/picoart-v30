// PicoArt v29 - SIMPLIFIED ARCHITECTURE
// Removed 19-artwork DB, Claude still selects style from 2-3 options per culture
// v29: 19개 작품 DB 제거 → Claude가 2-3개 주요 스타일 중 선택
// 한국: 민화/풍속도/산수화, 중국: 수묵화/공필화/화조화

// ========================================
// v29: NO ARTWORK DATABASE FILES
// Claude AI selects style (Minhwa/Pungsokdo/Gongbi/etc)
// FLUX renders with selected style
// ========================================

// Fallback 프롬프트 (AI 실패시 사용)
const fallbackPrompts = {
  ancient: {
    name: '고대 그리스-로마',
    prompt: 'ancient Greek and Roman classical painting style, idealized human forms, marble-like smooth rendering, heroic noble figures, classical drapery, temple architecture, serene dignified expressions, painted in ancient classical masterpiece quality'
  },
  
  byzantineIslamic: {
    name: '비잔틴·이슬람',
    prompt: 'Byzantine and Islamic art style, golden mosaic backgrounds, ornate geometric patterns, rich jewel-like colors, spiritual iconic forms, decorative arabesque motifs, sacred dignified atmosphere, painted in Byzantine-Islamic masterpiece quality'
  },
  
  renaissance: {
    name: '르네상스',
    prompt: 'Renaissance painting style, soft sfumato technique, harmonious balanced composition, warm golden Renaissance colors, detailed naturalistic rendering, gentle serene expressions, classical perspective, painted in Renaissance masterpiece quality'
  },
  
  baroque: {
    name: '바로크',
    prompt: 'Baroque painting style, dramatic chiaroscuro lighting, rich deep colors, dynamic diagonal composition, theatrical emotional atmosphere, strong contrast between light and shadow, painted in Baroque masterpiece quality'
  },
  
  rococo: {
    name: '로코코',
    prompt: 'Rococo painting style, light pastel colors, playful ornate decoration, soft delicate brushwork, romantic elegant atmosphere, graceful curved lines, whimsical charm, painted in Rococo masterpiece quality'
  },
  
  romanticism: {
    name: '낭만주의',
    prompt: 'Romantic painting style, dramatic emotional intensity, sublime natural beauty, vivid expressive colors, dynamic turbulent composition, passionate atmosphere, painted in Romantic masterpiece quality'
  },
  
  impressionism: {
    name: '인상주의',
    prompt: 'Impressionist painting style, visible short brushstrokes, pure unmixed colors, emphasis on natural light effects, outdoor plein-air atmosphere, capturing fleeting moments, painted in Impressionist masterpiece quality'
  },
  
  post_impressionism: {
    name: '후기인상주의',
    prompt: 'Post-Impressionist painting style, bold expressive colors, geometric structured forms, emotional symbolic content, innovative personal vision, painted in Post-Impressionist masterpiece quality'
  },
  
  postImpressionism: {
    name: '후기인상주의',
    prompt: 'Post-Impressionist painting style, bold expressive colors, geometric structured forms, emotional symbolic content, innovative personal vision, painted in Post-Impressionist masterpiece quality'
  },
  
  fauvism: {
    name: '야수파',
    prompt: 'Fauvist painting style, wild pure vivid colors, bold simplified forms, strong non-naturalistic palette, flat decorative patterns, expressive emotional intensity, painted in Fauvist masterpiece quality'
  },
  
  expressionism: {
    name: '표현주의',
    prompt: 'Expressionist painting style, intense emotional colors, distorted exaggerated forms, psychological depth, dramatic angular composition, inner feelings externalized, painted in Expressionist masterpiece quality'
  },
  
  klimt: {
    name: '클림트',
    prompt: 'painting by Gustav Klimt, golden ornamental patterns, Byzantine mosaic influence, decorative symbolic style, sensuous flowing forms, jewel-like colors, Art Nouveau elegance'
  },
  
  picasso: {
    name: '피카소',
    prompt: 'Cubist painting by Pablo Picasso, geometric fragmented forms, multiple simultaneous perspectives, abstract analytical composition, monochromatic or limited palette'
  },
  
  van_gogh: {
    name: '반 고흐',
    prompt: 'painting by Vincent van Gogh, thick expressive swirling brushstrokes, vibrant intense emotional colors, dynamic energetic composition, passionate turbulent style'
  },
  
  matisse: {
    name: '마티스',
    prompt: 'painting by Henri Matisse, bold pure flat colors, simplified harmonious forms, decorative rhythmic patterns, joyful life-affirming atmosphere'
  },
  
  munch: {
    name: '뭉크',
    prompt: 'painting by Edvard Munch, intense emotional psychological depth, symbolic expressive colors, haunting atmospheric mood, existential anxiety visualized'
  },
  
  dali: {
    name: '달리',
    prompt: 'Surrealist painting by Salvador Dalí, dreamlike hyperrealistic details, melting distorted forms, bizarre juxtapositions, subconscious imagery, precise meticulous technique'
  },
  
  // ========================================
  // 동양화 - AI가 스타일 자동 선택
  // ========================================
  korean: {
    name: '한국 전통화',
    prompt: 'Korean traditional painting in authentic Joseon Dynasty style. CRITICAL INSTRUCTIONS: 1) GENDER PRESERVATION - carefully preserve exact gender and facial features from original photo (male stays male with masculine face, female stays female with feminine features), 2) Choose appropriate Korean style based on photo subject (Minhwa folk art for animals/flowers with bold outlines and bright Obangsaek colors, Pungsokdo genre painting for people/daily life with refined brushwork, Jingyeong landscape for nature/mountains with expressive ink), 3) Use Korean aesthetic sensibility. ABSOLUTELY NO Japanese hiragana (ひらがな) or katakana (カタカナ). This is PURE KOREAN ART, not Japanese ukiyo-e.'
  },
  
  chinese: {
    name: '중국 전통화',
    prompt: 'Chinese traditional painting in authentic classical style. CRITICAL INSTRUCTIONS: 1) GENDER PRESERVATION - carefully preserve exact gender and facial features from original photo (male stays male with masculine face, female stays female with feminine features), 2) Choose appropriate Chinese style based on photo subject (Shuimohua ink wash for landscapes/nature with monochrome gradations, Gongbi meticulous painting for people/portraits with fine detailed brushwork and rich colors, Huaniao bird-and-flower for animals/plants with precise naturalistic rendering), 3) Use Chinese aesthetic principles. ABSOLUTELY NO Japanese hiragana (ひらがな) or katakana (カタカナ). This is PURE CHINESE ART.'
  },
  
  japanese: {
    name: '일본 우키요에',
    prompt: 'Japanese Ukiyo-e woodblock print style with flat areas of bold solid colors, strong clear black outlines, completely flat two-dimensional composition, decorative patterns, stylized simplified forms, elegant refined Japanese aesthetic, painted in authentic Japanese ukiyo-e masterpiece quality, Japanese kana allowed, NO Chinese characters, pure Japanese style only'
  },
  
  masters: {
    name: '거장 화풍',
    prompt: 'Master artist painting style, exceptional technical skill, distinctive artistic vision, profound emotional depth, timeless masterpiece quality'
  },
  
  oriental: {
    name: '동양화',
    prompt: 'Traditional East Asian painting style, ink wash brushwork, minimalist composition, harmony with nature, philosophical contemplation, painted in classical Oriental masterpiece quality'
  }
};

// v29: 동양화 DB 제거됨 - selectOrientalArtwork 함수 불필요

// AI 화가 자동 선택 (타임아웃 포함)
async function selectArtistWithAI(imageBase64, selectedStyle, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    // 모든 카테고리 동일 로직: AI가 사진 분석 후 최적 세부 스타일 선택
    let promptText;
    
    const categoryName = selectedStyle.name;
    const categoryType = selectedStyle.category;
    
    if (categoryType === 'masters') {
      // 거장: 사진에 가장 잘 맞는 시기/스타일 선택
      promptText = `Analyze this photo and select the BEST specific period or style from ${categoryName}'s works that matches this photo.

${categoryName} created works in various periods and styles. Analyze the photo and select which period/style would transform this photo most beautifully.

Instructions:
1. Analyze the photo: subject, mood, colors, composition, lighting, atmosphere
2. Consider ${categoryName}'s different periods and styles (early works, peak period, different techniques)
3. Match the photo's characteristics to the MOST SUITABLE period/style from ${categoryName}'s career
4. Generate a detailed FLUX prompt using that specific period's distinctive characteristics
5. IMPORTANT: Preserve the original subject - if it's a baby, keep it as a baby; if elderly, keep elderly

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo analysis (mood, colors, subject)",
  "selected_artist": "${categoryName}",
  "selected_period": "specific period or style name (e.g. Blue Period, Arles Period, Golden Period)",
  "reason": "why THIS specific period of ${categoryName} matches this photo perfectly",
  "prompt": "painting by ${categoryName} in [specific period], [that period's distinctive techniques and colors], depicting the subject while preserving original features and age"
}

Keep it concise and accurate.`;
      
    } else if (categoryType === 'oriental') {
      // v29: DB는 제거했지만 Claude가 여전히 스타일 선택
      const styleId = selectedStyle.id;
      
      if (styleId === 'korean') {
        // 한국 - Claude가 3가지 스타일 중 선택
        promptText = `Analyze this photo and select the BEST Korean traditional painting style.

You must choose ONE of these THREE styles:

Style 1: Korean Minhwa Folk Painting (민화)
- Best for: animals (tiger, magpie, fish), flowers (peony), birds, simple subjects
- Characteristics: THICK BLACK OUTLINES around all shapes, BRIGHT primary colors (Obangsaek: red/blue/yellow/white/black), completely FLAT naive composition, childlike playful aesthetic
- When: Photo has animals, flowers, or needs cheerful colorful treatment

Style 2: Korean Pungsokdo Genre Painting (풍속도)
- Best for: people, portraits, daily life, couples, festivals, human activities
- Characteristics: Refined delicate brushwork, figures in hanbok, soft pastel colors, narrative storytelling of Joseon life, elegant composition
- When: Photo has people, faces, human subjects

Style 3: Korean Jingyeong Landscape (진경산수)
- Best for: mountains, nature, rocks, landscapes, scenery
- Characteristics: Bold expressive brushwork, dramatic angular forms, monochrome ink with strong contrasts, REAL Korean scenery (not idealized Chinese mountains)
- When: Photo has natural landscapes, mountains, rocks

Analyze the photo and choose the MOST suitable style.

CRITICAL INSTRUCTIONS FOR PROMPT GENERATION:
1. GENDER PRESERVATION (MANDATORY IN PROMPT):
   - FIRST identify if photo has person(s) and their gender
   - If MALE in photo → prompt MUST start with "CRITICAL GENDER RULE: This photo shows MALE person, ABSOLUTELY PRESERVE MASCULINE FEATURES - strong jaw, masculine face, male body structure, DO NOT feminize, DO NOT make female-looking face, KEEP MALE GENDER EXACTLY."
   - If FEMALE in photo → prompt MUST start with "CRITICAL GENDER RULE: This photo shows FEMALE person, ABSOLUTELY PRESERVE FEMININE FEATURES - soft face, feminine features, female body structure, DO NOT masculinize, KEEP FEMALE GENDER EXACTLY."
   - This gender instruction MUST be the FIRST thing in your generated prompt before any style description

2. JAPANESE TEXT PROHIBITION (CRITICAL):
   - ABSOLUTELY NO Japanese hiragana (ひらがな) - NEVER ALLOWED
   - ABSOLUTELY NO Japanese katakana (カタカナ) - NEVER ALLOWED
   - Any Japanese text = COMPLETE FAILURE
   - This is KOREAN ART, not Japanese art

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo description including gender if person present (1 sentence)",
  "selected_artist": "Korean Minhwa" or "Korean Pungsokdo" or "Korean Jingyeong Landscape",
  "selected_style": "minhwa" or "pungsokdo" or "landscape",
  "reason": "why this style fits (1 sentence)",
  "prompt": "Complete FLUX prompt starting with GENDER RULE if person present, then 'Korean [style name]...' with all characteristics. MUST include 'ABSOLUTELY NO Japanese hiragana (ひらがな) or katakana (カタカナ), this is PURE KOREAN ART' at the end."
}

Keep it concise and accurate.`;
      }
      
      if (styleId === 'chinese') {
        // 중국 - Claude가 3가지 스타일 중 선택
        promptText = `Analyze this photo and select the BEST Chinese traditional painting style.

You must choose ONE of these THREE styles:

Style 1: Chinese Ink Wash Painting (水墨畫 Shuimohua)
- Best for: landscapes, mountains, nature, trees, contemplative subjects, simple compositions
- Characteristics: Monochrome black ink with gradations (deep black to light grey), soft flowing brushstrokes, minimalist composition with elegant empty space, misty atmosphere
- When: Photo has landscapes, nature, or needs meditative serene treatment

Style 2: Chinese Gongbi Meticulous Painting (工筆畫)
- Best for: portraits, people, detailed subjects, colorful compositions
- Characteristics: Extremely fine detailed brushwork, delicate precise lines, rich mineral pigments and brilliant colors, ornate decorative patterns, imperial court quality
- When: Photo has people, faces, or needs detailed colorful treatment

Style 3: Chinese Huaniao Bird-and-Flower (花鳥畫)
- Best for: birds, flowers, animals, plants, natural subjects
- Characteristics: Detailed naturalistic rendering, precise meticulous brushwork for feathers and petals, delicate soft colors, harmonious composition
- When: Photo has birds, flowers, animals, or plants

Analyze the photo and choose the MOST suitable style.

CRITICAL INSTRUCTIONS FOR PROMPT GENERATION:
1. GENDER PRESERVATION (MANDATORY IN PROMPT):
   - FIRST identify if photo has person(s) and their gender
   - If MALE in photo → prompt MUST start with "CRITICAL GENDER RULE: This photo shows MALE person, ABSOLUTELY PRESERVE MASCULINE FEATURES - strong jaw, masculine face, male body structure, DO NOT feminize, DO NOT make female-looking face, KEEP MALE GENDER EXACTLY."
   - If FEMALE in photo → prompt MUST start with "CRITICAL GENDER RULE: This photo shows FEMALE person, ABSOLUTELY PRESERVE FEMININE FEATURES - soft face, feminine features, female body structure, DO NOT masculinize, KEEP FEMALE GENDER EXACTLY."
   - This gender instruction MUST be the FIRST thing in your generated prompt before any style description

2. JAPANESE TEXT PROHIBITION (CRITICAL):
   - ABSOLUTELY NO Japanese hiragana (ひらがな) - NEVER ALLOWED
   - ABSOLUTELY NO Japanese katakana (カタカナ) - NEVER ALLOWED
   - Any Japanese text = COMPLETE FAILURE
   - This is CHINESE ART, not Japanese art

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo description including gender if person present (1 sentence)",
  "selected_artist": "Chinese Ink Wash" or "Chinese Gongbi" or "Chinese Huaniao",
  "selected_style": "ink_wash" or "gongbi" or "huaniao",
  "reason": "why this style fits (1 sentence)",
  "prompt": "Complete FLUX prompt starting with GENDER RULE if person present, then 'Chinese [style name]...' with all characteristics. MUST include 'ABSOLUTELY NO Japanese hiragana (ひらがな) or katakana (カタカナ), this is PURE CHINESE ART' at the end."
}

Keep it concise and accurate.`;
      }
      
      if (styleId === 'japanese') {
        // 일본 - 우키요에 고정
        return {
          success: true,
          artist: '일본 우키요에',
          reason: 'Japanese traditional ukiyo-e style',
          prompt: fallbackPrompts.japanese.prompt,
          analysis: 'Japanese ukiyo-e style applied'
        };
      }
      
    } else {
      // 미술사조: 사조 내 화가 중 최적 선택
      promptText = `Analyze this photo and select the BEST artist from ${categoryName} period/style to transform it.

Instructions:
1. Analyze: subject, age, mood, composition, lighting
2. Select the MOST SUITABLE ${categoryName} artist for THIS specific photo
3. Generate a detailed prompt for FLUX Depth in that artist's style
4. IMPORTANT: Preserve the original subject - if it's a baby, keep it as a baby; if elderly, keep elderly

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo description",
  "selected_artist": "Artist Full Name",
  "reason": "why this artist fits this photo",
  "prompt": "painting by [Artist], [artist's technique], [artist's characteristics], depicting the subject while preserving original features and age"
}

Keep it concise and accurate.`;
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',  // Claude Sonnet 4.5 (최신)
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64.split(',')[1]
              }
            },
            {
              type: 'text',
              text: promptText
            }
          ]
        }]
      })
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.content[0].text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const result = JSON.parse(text);
    
    // 검증
    if (!result.prompt || !result.selected_artist) {
      throw new Error('Invalid AI response format');
    }
    
    return {
      success: true,
      artist: result.selected_artist,
      reason: result.reason,
      prompt: result.prompt,
      analysis: result.analysis
    };
    
  } catch (error) {
    clearTimeout(timeout);
    console.error('AI selection failed:', error.message);
    return { success: false, error: error.message };
  }
}

// 메인 핸들러
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, selectedStyle } = req.body;

    // 디버깅 로그
    console.log('=== SDXL Transfer Debug ===');
    console.log('Has REPLICATE_API_KEY:', !!process.env.REPLICATE_API_KEY);
    console.log('Has ANTHROPIC_API_KEY:', !!process.env.ANTHROPIC_API_KEY);
    console.log('Has image:', !!image);
    console.log('Image length:', image ? image.length : 0);
    console.log('Image starts with:', image ? image.substring(0, 50) : 'N/A');
    console.log('Has selectedStyle:', !!selectedStyle);
    console.log('selectedStyle:', selectedStyle);

    if (!process.env.REPLICATE_API_KEY) {
      console.error('ERROR: REPLICATE_API_KEY not configured');
      return res.status(500).json({ error: 'Replicate API key not configured' });
    }

    if (!image || !selectedStyle) {
      console.error('ERROR: Missing image or selectedStyle');
      console.error('image exists:', !!image);
      console.error('selectedStyle:', JSON.stringify(selectedStyle, null, 2));
      return res.status(400).json({ error: 'Missing image or style' });
    }

    // selectedStyle 구조 검증
    if (!selectedStyle.name || !selectedStyle.category) {
      console.error('ERROR: Invalid selectedStyle structure');
      console.error('selectedStyle:', JSON.stringify(selectedStyle, null, 2));
      return res.status(400).json({ 
        error: 'Invalid style structure',
        details: 'Missing name or category'
      });
    }

    let finalPrompt;
    let selectedArtist;
    let selectionMethod;
    let selectionDetails = {};

    // v29: 모든 스타일이 동일하게 처리됨 (동양화 DB 제거)
    // 한국/중국/일본 모두 fallback 프롬프트 또는 AI 선택 사용
    
    if (selectedStyle.category === 'oriental' && selectedStyle.id === 'japanese') {
      // 일본 우키요에 (고정)
      console.log('Japanese Ukiyo-e - using fixed style');
      
      const fallback = fallbackPrompts.japanese;
      finalPrompt = fallback.prompt;
      selectedArtist = fallback.name;
      selectionMethod = 'oriental_fixed';
      selectionDetails = {
        style: 'japanese_ukiyoe'
      };
      
    } else if (process.env.ANTHROPIC_API_KEY) {
      console.log(`Trying AI artist selection for ${selectedStyle.name}...`);
      
      const aiResult = await selectArtistWithAI(
        image, 
        selectedStyle,  // ← selectedStyle 객체 전체 전달
        8000 // 8초 타임아웃
      );
      
      if (aiResult.success) {
        // AI 성공!
        finalPrompt = aiResult.prompt;
        selectedArtist = aiResult.artist;
        selectionMethod = 'ai_auto';
        selectionDetails = {
          analysis: aiResult.analysis,
          reason: aiResult.reason
        };
        console.log('✅ AI selected:', selectedArtist);
      } else {
        // AI 실패 → Fallback
        console.log('⚠️ AI failed, using fallback');
        
        // 거장/동양화는 id에서 키 추출, 미술사조는 category 사용
        let fallbackKey = selectedStyle.category;
        
        if (selectedStyle.category === 'masters') {
          // 'picasso-master' → 'picasso'
          fallbackKey = selectedStyle.id.replace('-master', '');
          
          // 특수 케이스: vangogh → van_gogh
          if (fallbackKey === 'vangogh') {
            fallbackKey = 'van_gogh';
          }
        } else if (selectedStyle.category === 'oriental') {
          // v29: 동양화는 간단하게 id 그대로 사용
          fallbackKey = selectedStyle.id;  // korean, chinese, japanese
        }
        
        console.log('Using fallback key:', fallbackKey);
        const fallback = fallbackPrompts[fallbackKey];
        
        if (!fallback) {
          console.error('ERROR: No fallback found for key:', fallbackKey);
          console.error('Available categories:', Object.keys(fallbackPrompts));
          throw new Error(`No fallback prompt for: ${fallbackKey}`);
        }
        
        finalPrompt = fallback.prompt;
        selectedArtist = fallback.name;
        selectionMethod = 'fallback';
        selectionDetails = {
          ai_error: aiResult.error
        };
      }
    } else {
      // ANTHROPIC_API_KEY 없음 → Fallback
      console.log('ℹ️ No AI key, using fallback');
      
      // 거장/동양화는 id에서 키 추출, 미술사조는 category 사용
      let fallbackKey = selectedStyle.category;
      
      if (selectedStyle.category === 'masters') {
        // 'picasso-master' → 'picasso'
        fallbackKey = selectedStyle.id.replace('-master', '');
        
        // 특수 케이스: vangogh → van_gogh
        if (fallbackKey === 'vangogh') {
          fallbackKey = 'van_gogh';
        }
      } else if (selectedStyle.category === 'oriental') {
        // v29: 동양화는 간단하게 id 그대로 사용
        fallbackKey = selectedStyle.id;  // korean, chinese, japanese
      }
      
      console.log('Using fallback key:', fallbackKey);
      const fallback = fallbackPrompts[fallbackKey];
      
      if (!fallback) {
        console.error('ERROR: No fallback found for key:', fallbackKey);
        console.error('Available categories:', Object.keys(fallbackPrompts));
        throw new Error(`No fallback prompt for: ${fallbackKey}`);
      }
      
      finalPrompt = fallback.prompt;
      selectedArtist = fallback.name;
      selectionMethod = 'fallback_no_key';
    }

    console.log('Final prompt:', finalPrompt);
    
    // FLUX Depth 변환 (최신 API 버전)
    const response = await fetch(
      'https://api.replicate.com/v1/models/black-forest-labs/flux-depth-dev/predictions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait'
        },
        body: JSON.stringify({
          input: {
            control_image: image,
            prompt: finalPrompt,
            num_inference_steps: 24,       // 28→24 속도 최적화 (약 20% 빠름)
            guidance: 12,                   // 프롬프트 엄격 준수 (일본어/성별 보존)
            control_strength: 1.0,          // 구도 완벽 유지 (일관성 최대화)
            output_format: 'jpg',
            output_quality: 90
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FLUX Depth error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `FLUX API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('✅ FLUX Depth completed');
    
    // 결과에 선택 정보 포함
    res.status(200).json({
      ...data,
      selected_artist: selectedArtist,
      selection_method: selectionMethod,
      selection_details: selectionDetails
    });
    
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/*
작동 방식:

시나리오 1: AI 성공 (95%)
─────────────────────────
사진: 아기
선택: 바로크

AI 분석 중... (3초)
✅ AI 선택: 루벤스
이유: "아기 그림 전문"
프롬프트: "Baroque by Rubens, cherubic baby..."

FLUX 변환... (30초)
결과: 루벤스 스타일 아기 ✅

시나리오 2: AI 실패 (5%)
─────────────────────────
사진: 아기
선택: 바로크

AI 분석 중... (타임아웃 또는 에러)
⚠️ Fallback 사용
프롬프트: "Baroque style, dramatic lighting..."

FLUX 변환... (30초)
결과: 바로크 스타일 아기 ✅ (화가명 없지만 작동)

시나리오 3: API 키 없음
─────────────────────────
ℹ️ AI 키 없음
Fallback 사용

FLUX 변환... (30초)
결과: 기본 스타일 ✅
*/
