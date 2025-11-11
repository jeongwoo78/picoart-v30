// PicoArt v31 - Art Movements Refined
// v31: 미술사조 10개 확정 + 거장 6명 시간순 정렬
//
// 미술사조 10개 (시간순):
//   1. 고대 그리스-로마 (BC 800~AD 400)
//   2. 비잔틴·이슬람 (4~15세기)
//   3. 르네상스 (1400~1600)
//   4. 바로크 (1600~1750)
//   5. 신고전주의 (1770~1840) ⭐ NEW
//   6. 낭만주의 (1800~1850)
//   7. 사실주의 (1840~1870) ⭐ NEW
//   8. 인상주의 (1860~1890)
//   9. 후기인상주의 (1880~1910)
//  10. 표현주의 (1905~1920)
//
// 제외: 로코코 (대중성 낮음), 야수파 (마티스로 보완)
//
// 거장 6명 (시간순 + 생사연도):
//   1. 반 고흐 (1853-1890, 후기인상주의)
//   2. 클림트 (1862-1918, 아르누보)
//   3. 마티스 (1869-1954, 야수파)
//   4. 뭉크 (1863-1944, 표현주의)
//   5. 피카소 (1881-1973, 입체주의)
//   6. 달리 (1904-1989, 초현실주의)
//
// ========================================
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
  
  neoclassicism: {
    name: '신고전주의',
    prompt: 'Neoclassical painting style, clean precise lines, smooth marble-like surfaces, idealized classical forms, balanced symmetrical composition, clear rational structure, heroic noble subjects, muted dignified colors, inspired by ancient Greek and Roman art, painted in Neoclassical masterpiece quality by Jacques-Louis David'
  },
  
  romanticism: {
    name: '낭만주의',
    prompt: 'Romantic painting style, dramatic emotional intensity, sublime natural beauty, vivid expressive colors, dynamic turbulent composition, passionate atmosphere, painted in Romantic masterpiece quality'
  },
  
  realism: {
    name: '사실주의',
    prompt: 'Realist painting style, honest unidealized depiction of everyday life, working class and peasant subjects, earthy natural colors, solid three-dimensional forms, direct observation of reality, social commentary, dignified portrayal of common people, painted in Realist masterpiece quality by Gustave Courbet or Jean-François Millet'
  },
  
  impressionism: {
    name: '인상주의',
    prompt: 'Impressionist painting style, visible short brushstrokes, pure unmixed colors, emphasis on natural light effects, outdoor plein-air atmosphere, capturing fleeting moments, painted in Impressionist masterpiece quality'
  },
  
  postImpressionism: {
    name: '후기인상주의',
    prompt: 'Post-Impressionist painting style, bold expressive colors, geometric structured forms, emotional symbolic content, innovative personal vision, painted in Post-Impressionist masterpiece quality'
  },
  
  expressionism: {
    name: '표현주의',
    prompt: 'Expressionist painting style, intense emotional colors, distorted exaggerated forms, psychological depth, dramatic angular composition, inner feelings externalized, painted in Expressionist masterpiece quality'
  },
  
  // ========================================
  // 거장 6명 (시간순 정렬 + 생사연도)
  // ========================================
  
  van_gogh: {
    name: '반 고흐',
    artist: 'Vincent van Gogh (1853-1890)',
    movement: '후기인상주의 (Post-Impressionism)',
    prompt: 'painting by Vincent van Gogh, thick expressive swirling brushstrokes, vibrant intense emotional colors, dynamic energetic composition, passionate turbulent style'
  },
  
  klimt: {
    name: '클림트',
    artist: 'Gustav Klimt (1862-1918)',
    movement: '아르누보 (Art Nouveau)',
    prompt: 'painting by Gustav Klimt, golden ornamental patterns, Byzantine mosaic influence, decorative symbolic style, sensuous flowing forms, jewel-like colors, Art Nouveau elegance'
  },
  
  munch: {
    name: '뭉크',
    artist: 'Edvard Munch (1863-1944)',
    movement: '표현주의 (Expressionism)',
    prompt: 'painting by Edvard Munch, intense emotional psychological depth, symbolic expressive colors, haunting atmospheric mood, existential anxiety visualized'
  },
  
  matisse: {
    name: '마티스',
    artist: 'Henri Matisse (1869-1954)',
    movement: '야수파 (Fauvism)',
    prompt: 'painting by Henri Matisse, bold pure flat colors, simplified harmonious forms, decorative rhythmic patterns, joyful life-affirming atmosphere'
  },
  
  picasso: {
    name: '피카소',
    artist: 'Pablo Picasso (1881-1973)',
    movement: '입체주의 (Cubism)',
    prompt: 'Cubist painting by Pablo Picasso, geometric fragmented forms, multiple simultaneous perspectives, abstract analytical composition, monochromatic or limited palette'
  },
  
  dali: {
    name: '달리',
    artist: 'Salvador Dalí (1904-1989)',
    movement: '초현실주의 (Surrealism)',
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
      const styleId = selectedStyle.id;
      
      if (styleId === 'korean') {
        // 한국 - Claude가 3가지 스타일 중 선택
        promptText = `Analyze this photo and select the BEST Korean traditional painting style.

You must choose ONE of these THREE styles:

Style 1: Korean Minhwa Folk Painting (민화)
- Best for: animals (tiger, magpie, fish), flowers (peony), birds, buildings, architecture, man-made objects, simple subjects
- Characteristics: THICK BLACK OUTLINES around all shapes, BRIGHT primary colors (Obangsaek: red/blue/yellow/white/black), completely FLAT naive composition, childlike playful aesthetic
- When: Photo has animals, flowers, buildings, architecture, man-made structures, or needs cheerful colorful treatment

Style 2: Korean Pungsokdo Genre Painting (풍속도) ⭐ DEFAULT FOR PEOPLE
- Best for: ANY photo with PEOPLE, portraits, faces, human subjects, daily life, couples, festivals
- Characteristics: Refined delicate brushwork, figures in hanbok, soft pastel colors, narrative storytelling of Joseon life, elegant composition
- When: Photo has ANY people, faces, human subjects → ALWAYS CHOOSE THIS

Style 3: Korean Jingyeong True-View Landscape (진경산수화)
- Best for: pure landscapes without people, mountains, rivers, natural scenery, outdoor nature
- Characteristics: Bold ink strokes, distinctive Korean mountain shapes, dynamic vertical composition, expressive brushwork
- When: Photo is natural scenery without human figures

CRITICAL DECISION RULES:
- Has PEOPLE (any human face/figure)? → MUST choose Pungsokdo (Style 2)
- Has animals, flowers, or buildings? → Choose Minhwa (Style 1)
- Pure landscape with NO people? → Choose Jingyeong (Style 3)

GENDER PRESERVATION WARNING:
Korean traditional paintings often feminized male subjects historically. You MUST preserve original gender:
- Male photo → Keep masculine features, facial structure, body proportions
- Female photo → Keep feminine features
- DO NOT make men look like women in hanbok

ABSOLUTELY PROHIBITED:
- NO Japanese hiragana (ひらがな) characters
- NO Japanese katakana (カタカナ) characters  
- NO Japanese calligraphy style
- This is PURE KOREAN ART, not Japanese ukiyo-e

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief analysis of photo subject",
  "selected_artist": "Korean Traditional Painting",
  "selected_style": "Minhwa" or "Pungsokdo" or "Jingyeong",
  "reason": "why this specific Korean style matches the photo",
  "prompt": "Korean traditional [style name] painting in authentic Joseon Dynasty style, [style-specific techniques], depicting [subject]. CRITICAL: preserve exact gender from photo. ABSOLUTELY NO Japanese hiragana or katakana."
}`;

      } else if (styleId === 'chinese') {
        // 중국 - Claude가 3가지 스타일 중 선택
        promptText = `Analyze this photo and select the BEST Chinese traditional painting style.

You must choose ONE of these THREE styles:

Style 1: Chinese Shuimohua Ink Wash Painting (水墨画)
- Best for: landscapes, mountains, rivers, bamboo, nature scenes without people
- Characteristics: Monochrome ink gradations (light to dark), expressive brushwork, emphasis on empty space, philosophical contemplation
- When: Photo is natural scenery, landscapes, plants

Style 2: Chinese Gongbi Meticulous Painting (工笔画) ⭐ DEFAULT FOR PEOPLE
- Best for: ANY photo with PEOPLE, portraits, faces, human subjects, detailed subjects
- Characteristics: Extremely fine detailed lines, rich mineral colors, meticulous rendering, court painting style, precise brushwork
- When: Photo has ANY people, faces, human figures → ALWAYS CHOOSE THIS

Style 3: Chinese Huaniao Bird-and-Flower Painting (花鸟画)
- Best for: birds, flowers, insects, fish, small animals, plants
- Characteristics: Delicate naturalistic rendering, symbolic meanings, balanced composition, combining precision with spontaneity
- When: Photo has birds, flowers, animals, insects

CRITICAL DECISION RULES:
- Has PEOPLE (any human face/figure)? → MUST choose Gongbi (Style 2)
- Has birds, flowers, or animals? → Choose Huaniao (Style 3)
- Pure landscape or nature? → Choose Shuimohua (Style 1)

GENDER PRESERVATION WARNING:
Chinese paintings sometimes idealized subjects. You MUST preserve original gender:
- Male photo → Keep masculine features, strong facial structure
- Female photo → Keep feminine features, graceful lines
- DO NOT change gender characteristics

ABSOLUTELY PROHIBITED:
- NO Japanese hiragana (ひらがな) characters
- NO Japanese katakana (カタカナ) characters
- NO Japanese calligraphy style
- ONLY Chinese characters (漢字/汉字) allowed if any text needed
- This is PURE CHINESE ART, not Japanese

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief analysis of photo subject",
  "selected_artist": "Chinese Traditional Painting",
  "selected_style": "Shuimohua" or "Gongbi" or "Huaniao",
  "reason": "why this specific Chinese style matches the photo",
  "prompt": "Chinese traditional [style name] painting in authentic classical style, [style-specific techniques], depicting [subject]. CRITICAL: preserve exact gender from photo. ABSOLUTELY NO Japanese hiragana or katakana. ONLY Chinese characters."
}`;

      } else if (styleId === 'japanese') {
        // 일본 - 우키요에 고정
        promptText = `Analyze this photo for Japanese Ukiyo-e woodblock print style transformation.

Style: Japanese Ukiyo-e (浮世絵)
- Characteristics: Flat bold colors, strong black outlines, completely flat 2D composition, decorative patterns, stylized forms
- Technique: Woodblock print aesthetic with solid color areas, no gradation, clear contours

CRITICAL INSTRUCTIONS:
1. Preserve original subject and composition
2. Apply flat decorative Ukiyo-e style
3. Use bold outlines and solid colors
4. Japanese kana (hiragana/katakana) allowed for authenticity
5. NO Chinese-style calligraphy

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief analysis of photo",
  "selected_artist": "Japanese Ukiyo-e",
  "selected_style": "Ukiyo-e",
  "reason": "how Ukiyo-e style will transform this photo",
  "prompt": "Japanese Ukiyo-e woodblock print style, flat bold colors, strong black outlines, completely flat 2D composition, decorative patterns, depicting [subject]. Japanese kana allowed. NO Chinese characters."
}`;
      }
      
    } else {
      // 미술 사조 (ancient, renaissance, baroque, etc.)
      promptText = `Analyze this photo and determine the best way to transform it into ${categoryName} style.

${categoryName} is a rich art movement with many representative artists and sub-styles. Your task:

1. Analyze the photo: subject, mood, colors, composition, lighting
2. Select the MOST SUITABLE artist or sub-style within ${categoryName} that would transform this photo beautifully
3. Consider which artist's techniques would best capture the essence of this photo
4. Generate a detailed FLUX prompt using that specific artist's distinctive style

IMPORTANT: Preserve the original subject - don't change babies to adults or vice versa.

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo analysis",
  "selected_artist": "specific artist name or sub-style within ${categoryName}",
  "reason": "why this artist/style is perfect for this photo",
  "prompt": "${categoryName} painting in the style of [specific artist], [their distinctive techniques], depicting the subject while preserving original features"
}

Example artists for common movements:
- Renaissance: Leonardo da Vinci, Raphael, Botticelli
- Baroque: Caravaggio, Rembrandt, Rubens
- Romanticism: Caspar David Friedrich, Turner, Delacroix
- Impressionism: Monet, Renoir, Degas

Keep it concise and accurate.`;
    }

    console.log('Calling Claude API for artist selection...');
    
    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
                }
              },
              {
                type: 'text',
                text: promptText
              }
            ]
          }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Claude API error:', apiResponse.status, errorText);
      throw new Error(`Claude API error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    const responseText = data.content[0].text;
    
    console.log('Claude raw response:', responseText);

    // JSON 파싱 (마크다운 코드블록 제거)
    let jsonText = responseText.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const result = JSON.parse(jsonText);
    
    console.log('Parsed result:', result);

    return {
      success: true,
      artist: result.selected_artist,
      style: result.selected_style || result.selected_period,
      prompt: result.prompt,
      analysis: result.analysis,
      reason: result.reason
    };

  } catch (error) {
    clearTimeout(timeout);
    
    if (error.name === 'AbortError') {
      console.log('AI selection timeout');
      return { success: false, error: 'timeout' };
    }
    
    console.error('AI selection error:', error);
    return { success: false, error: error.message };
  }
}

// Vercel Serverless Function Handler
export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, selectedStyle } = req.body;

    if (!image || !selectedStyle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Processing request for style:', selectedStyle.name);

    let finalPrompt;
    let selectedArtist;
    let selectionMethod;
    let selectionDetails = {};

    // 일본 우키요에는 AI 없이 고정 프롬프트 사용
    if (selectedStyle.id === 'japanese') {
      console.log('Japanese ukiyo-e: using fixed prompt');
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
        selectedStyle,
        15000 // 15초 타임아웃
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
        selectedArtist = fallback.artist || fallback.name;
        selectionMethod = 'fallback';
        selectionDetails = {
          ai_error: aiResult.error
        };
      }
    } else {
      // ANTHROPIC_API_KEY 없음 → Fallback
      console.log('ℹ️ No AI key, using fallback');
      
      let fallbackKey = selectedStyle.category;
      
      if (selectedStyle.category === 'masters') {
        fallbackKey = selectedStyle.id.replace('-master', '');
        if (fallbackKey === 'vangogh') {
          fallbackKey = 'van_gogh';
        }
      } else if (selectedStyle.category === 'oriental') {
        fallbackKey = selectedStyle.id;
      }
      
      console.log('Using fallback key:', fallbackKey);
      const fallback = fallbackPrompts[fallbackKey];
      
      if (!fallback) {
        console.error('ERROR: No fallback found for key:', fallbackKey);
        console.error('Available categories:', Object.keys(fallbackPrompts));
        throw new Error(`No fallback prompt for: ${fallbackKey}`);
      }
      
      finalPrompt = fallback.prompt;
      selectedArtist = fallback.artist || fallback.name;
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
            num_inference_steps: 24,
            guidance: 12,
            control_strength: 1.0,
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
