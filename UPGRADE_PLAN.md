# HALCON Astrology Features Upgrade Plan
## Plan Integral de Actualización con Soporte Multilingüe
## Plan de Mise à Niveau avec Support Multilingue

**Version:** 2.0  
**Last Updated:** 2025-10-06  
**Languages:** English, Español, Français

---

## 🎯 Executive Summary | Resumen Ejecutivo | Résumé Exécutif

This plan details the complete upgrade of HALCON with **4 advanced astrology features** plus **multilingual support**:

**Este plan detalla la actualización completa de HALCON con 4 funciones astrológicas avanzadas más soporte multilingüe:**

**Ce plan détaille la mise à niveau complète de HALCON avec 4 fonctionnalités astrologiques avancées plus le support multilingue:**

1. **House Systems** | **Sistemas de Casas** | **Systèmes de Maisons**
2. **Synastry** | **Sinastría** | **Synastrie**
3. **Astrocartography** | **Astrocartografía** | **Astrocartographie**
4. **Solar Returns** | **Revoluciones Solares** | **Révolutions Solaires**
5. **🆕 Multilingual Support** | **🆕 Soporte Multilingüe** | **🆕 Support Multilingue**

**Key Infrastructure:**
- Swiss Ephemeris Node.js wrapper (`swisseph` package)
- i18n internationalization library (`i18next`)
- Claude API with multilingual prompt engineering

**Development Approach:** Test-Driven Development (TDD) with separate feature branches

---

## 🌍 NEW FEATURE: Multilingual Support

### Language Support Matrix

| Feature | English | Español | Français |
|---------|---------|---------|----------|
| Natural Language Input | ✅ | ✅ | ✅ |
| Command Outputs | ✅ | ✅ | ✅ |
| Documentation | ✅ | ✅ | ✅ |
| Error Messages | ✅ | ✅ | ✅ |
| MCP Server Responses | ✅ | ✅ | ✅ |

### Architecture for Multilingual Support

**Files to Create:**
```
claude-sdk-microservice/src/
├── i18n/
│   ├── index.ts                    # i18n configuration
│   ├── locales/
│   │   ├── en.json                 # English translations
│   │   ├── es.json                 # Spanish translations
│   │   └── fr.json                 # French translations
│   └── language-detector.ts        # Auto-detect language
├── lib/
│   └── nlp/
│       ├── multilingual-parser.ts  # Parse input in any language
│       └── claude-multilingual.ts  # Claude API with language context
src/__tests__/
├── unit/
│   ├── i18n.test.ts
│   └── multilingual-parser.test.ts
```

### Natural Language Examples

#### House Systems

**English:**
```bash
halcon houses march 10 1990, kurnool india, 12:55 PM (manu)
halcon houses what are my astrological houses for today?
```

**Español:**
```bash
halcon houses 10 de marzo 1990, kurnool india, 12:55 PM (manu)
halcon houses cuáles son mis casas astrológicas para hoy?
halcon houses muéstrame las casas placidus
```

**Français:**
```bash
halcon houses 10 mars 1990, kurnool inde, 12:55 (manu)
halcon houses quelles sont mes maisons astrologiques aujourd'hui?
halcon houses montre-moi les maisons placidus
```

#### Synastry

**English:**
```bash
halcon synastry manu with alice
halcon synastry show me compatibility between two charts
```

**Español:**
```bash
halcon synastry manu con alice
halcon synastry muéstrame la compatibilidad entre dos cartas
halcon synastry análisis de sinastría entre manu y alice
```

**Français:**
```bash
halcon synastry manu avec alice
halcon synastry montre-moi la compatibilité entre deux thèmes
halcon synastry analyse de synastrie entre manu et alice
```

#### Astrocartography

**English:**
```bash
halcon astromap where should I live for career success?
halcon astromap best locations for love
```

**Español:**
```bash
halcon astromap dónde debería vivir para éxito profesional?
halcon astromap mejores ubicaciones para el amor
halcon astromap líneas planetarias en París
```

**Français:**
```bash
halcon astromap où devrais-je vivre pour réussir ma carrière?
halcon astromap meilleures localisations pour l'amour
halcon astromap lignes planétaires à Paris
```

#### Solar Returns

**English:**
```bash
halcon solar-return what does this year hold for me?
halcon solar-return my birthday chart for 2026
```

**Español:**
```bash
halcon solar-return qué me depara este año?
halcon solar-return mi carta de cumpleaños para 2026
halcon solar-return revolución solar de manu
```

**Français:**
```bash
halcon solar-return que me réserve cette année?
halcon solar-return mon thème d'anniversaire pour 2026
halcon solar-return révolution solaire de manu
```

### Multilingual Output Examples

#### House Systems Output

**English:**
```
🏠 House System: Placidus
Birth: March 10, 1990, 12:55 PM
Location: Kurnool, India (15.83°N, 78.04°E)
─────────────────────────────────────────────────────────────────
House 1 (ASC)   19.69° Pisces     ☉ Sun, ☿ Mercury
House 2         12.34° Aries
House 3          5.67° Taurus
...
```

**Español:**
```
🏠 Sistema de Casas: Placidus
Nacimiento: 10 de marzo, 1990, 12:55 PM
Ubicación: Kurnool, India (15.83°N, 78.04°E)
─────────────────────────────────────────────────────────────────
Casa 1 (ASC)    19.69° Piscis     ☉ Sol, ☿ Mercurio
Casa 2          12.34° Aries
Casa 3           5.67° Tauro
...
```

**Français:**
```
🏠 Système de Maisons: Placidus
Naissance: 10 mars, 1990, 12:55
Lieu: Kurnool, Inde (15.83°N, 78.04°E)
─────────────────────────────────────────────────────────────────
Maison 1 (ASC)  19.69° Poissons   ☉ Soleil, ☿ Mercure
Maison 2        12.34° Bélier
Maison 3         5.67° Taureau
...
```

### Language Detection

**Automatic Detection:**
The system will automatically detect the input language based on:
1. Keyword analysis (e.g., "muéstrame" → Spanish)
2. Date format patterns (e.g., "10 de marzo" → Spanish)
3. Month names (e.g., "mars" → French, "marzo" → Spanish)
4. User preference from profile (saved language)

**Manual Override:**
```bash
# Force language output
halcon houses manu --lang es
halcon synastry manu alice --lang fr
halcon astromap --lang en

# Set default language
halcon config set-language español
halcon config set-language français
halcon config set-language english
```

### i18n Translation Files

**Structure:**
```json
// en.json
{
  "commands": {
    "houses": {
      "title": "House System",
      "birth": "Birth",
      "location": "Location",
      "house": "House"
    },
    "synastry": {
      "title": "Synastry Analysis",
      "person1": "Person 1",
      "person2": "Person 2",
      "compatibility": "Compatibility Score"
    }
  },
  "planets": {
    "sun": "Sun",
    "moon": "Moon",
    "mercury": "Mercury",
    "venus": "Venus",
    "mars": "Mars",
    "jupiter": "Jupiter",
    "saturn": "Saturn"
  },
  "signs": {
    "aries": "Aries",
    "taurus": "Taurus",
    "gemini": "Gemini",
    "cancer": "Cancer",
    "leo": "Leo",
    "virgo": "Virgo",
    "libra": "Libra",
    "scorpio": "Scorpio",
    "sagittarius": "Sagittarius",
    "capricorn": "Capricorn",
    "aquarius": "Aquarius",
    "pisces": "Pisces"
  }
}

// es.json
{
  "commands": {
    "houses": {
      "title": "Sistema de Casas",
      "birth": "Nacimiento",
      "location": "Ubicación",
      "house": "Casa"
    },
    "synastry": {
      "title": "Análisis de Sinastría",
      "person1": "Persona 1",
      "person2": "Persona 2",
      "compatibility": "Puntuación de Compatibilidad"
    }
  },
  "planets": {
    "sun": "Sol",
    "moon": "Luna",
    "mercury": "Mercurio",
    "venus": "Venus",
    "mars": "Marte",
    "jupiter": "Júpiter",
    "saturn": "Saturno"
  },
  "signs": {
    "aries": "Aries",
    "taurus": "Tauro",
    "gemini": "Géminis",
    "cancer": "Cáncer",
    "leo": "Leo",
    "virgo": "Virgo",
    "libra": "Libra",
    "scorpio": "Escorpio",
    "sagittarius": "Sagitario",
    "capricorn": "Capricornio",
    "aquarius": "Acuario",
    "pisces": "Piscis"
  }
}

// fr.json
{
  "commands": {
    "houses": {
      "title": "Système de Maisons",
      "birth": "Naissance",
      "location": "Lieu",
      "house": "Maison"
    },
    "synastry": {
      "title": "Analyse de Synastrie",
      "person1": "Personne 1",
      "person2": "Personne 2",
      "compatibility": "Score de Compatibilité"
    }
  },
  "planets": {
    "sun": "Soleil",
    "moon": "Lune",
    "mercury": "Mercure",
    "venus": "Vénus",
    "mars": "Mars",
    "jupiter": "Jupiter",
    "saturn": "Saturne"
  },
  "signs": {
    "aries": "Bélier",
    "taurus": "Taureau",
    "gemini": "Gémeaux",
    "cancer": "Cancer",
    "leo": "Lion",
    "virgo": "Vierge",
    "libra": "Balance",
    "scorpio": "Scorpion",
    "sagittarius": "Sagittaire",
    "capricorn": "Capricorne",
    "aquarius": "Verseau",
    "pisces": "Poissons"
  }
}
```

### Claude API Multilingual Integration

**Prompt Engineering for Language Detection:**
```typescript
const multilingualPrompt = `
You are a multilingual astrological assistant supporting English, Spanish, and French.

Analyze this input and:
1. Detect the language (en/es/fr)
2. Extract the astrological data
3. Respond in the SAME language as the input

Input: "${userInput}"

Return JSON:
{
  "language": "en|es|fr",
  "intent": "houses|synastry|astromap|solar-return",
  "data": {
    "date": "YYYY-MM-DD",
    "time": "HH:MM:SS",
    "location": "city, country",
    "name": "optional"
  },
  "response_language": "en|es|fr"
}
`;
```

### TDD for Multilingual Support

**Test Cases:**
```typescript
// multilingual-parser.test.ts
describe('MultilingualParser', () => {
  describe('Language Detection', () => {
    it('should detect English input', () => {
      const input = "show me my houses for march 10 1990";
      expect(parser.detectLanguage(input)).toBe('en');
    });
    
    it('should detect Spanish input', () => {
      const input = "muéstrame mis casas para 10 de marzo 1990";
      expect(parser.detectLanguage(input)).toBe('es');
    });
    
    it('should detect French input', () => {
      const input = "montre-moi mes maisons pour 10 mars 1990";
      expect(parser.detectLanguage(input)).toBe('fr');
    });
  });
  
  describe('Date Parsing', () => {
    it('should parse English date format', () => {
      const input = "march 10 1990";
      expect(parser.parseDate(input, 'en')).toBe('1990-03-10');
    });
    
    it('should parse Spanish date format', () => {
      const input = "10 de marzo 1990";
      expect(parser.parseDate(input, 'es')).toBe('1990-03-10');
    });
    
    it('should parse French date format', () => {
      const input = "10 mars 1990";
      expect(parser.parseDate(input, 'fr')).toBe('1990-03-10');
    });
  });
  
  describe('Output Translation', () => {
    it('should format output in English', async () => {
      const data = { planet: 'sun', sign: 'pisces' };
      const output = await formatter.format(data, 'en');
      expect(output).toContain('Sun');
      expect(output).toContain('Pisces');
    });
    
    it('should format output in Spanish', async () => {
      const data = { planet: 'sun', sign: 'pisces' };
      const output = await formatter.format(data, 'es');
      expect(output).toContain('Sol');
      expect(output).toContain('Piscis');
    });
    
    it('should format output in French', async () => {
      const data = { planet: 'sun', sign: 'pisces' };
      const output = await formatter.format(data, 'fr');
      expect(output).toContain('Soleil');
      expect(output).toContain('Poissons');
    });
  });
});
```

---

## 📦 Updated Dependency Installation

```bash
# Core astronomical calculations
npm install swisseph --save

# Internationalization
npm install i18next --save
npm install i18next-fs-backend --save
npm install i18next-http-middleware --save

# Development dependencies
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @types/node
npm install --save-dev @types/i18next
npm install --save-dev eslint prettier
```

---

## 🌿 Updated GitHub Branching Strategy

### Branch Structure
```
main (protected)
├── develop (integration branch)
├── feature/multilingual-support   # 🆕 NEW
├── feature/house-systems
├── feature/synastry
├── feature/astrocartography
└── feature/solar-returns
```

### Implementation Priority

**Phase 0.5: Multilingual Infrastructure (NEW)**
- Week 1: i18n setup and configuration
- Week 2: Language detection and parsing
- Week 3: Translation files for all languages
- Week 4: Claude API multilingual integration
- Week 5: Testing and refinement

**Then continue with original phases...**

---

## 🔄 Updated Implementation Workflow

### Feature: Multilingual Support (PRIORITY)

**Branch:** `feature/multilingual-support`

**Week 1: i18n Setup**
1. Install i18next and dependencies
2. Configure i18n with locale files
3. Write tests for language detection
4. Write tests for translation loading

**Week 2: Parser Implementation**
1. Implement multilingual date parser
2. Implement location parser (ES/FR/EN)
3. Implement intent detection
4. Test with all three languages

**Week 3: Translation Files**
1. Create comprehensive en.json
2. Create comprehensive es.json
3. Create comprehensive fr.json
4. Validate all translations

**Week 4: Claude Integration**
1. Update Claude prompts for multilingual
2. Implement response translation
3. Add language preference to profiles
4. Test end-to-end workflows

**Week 5: Polish & Documentation**
1. Add language switching commands
2. Update all README files (EN/ES/FR)
3. Create multilingual examples
4. Integration testing

---

## 🎯 Updated Success Criteria

✅ All features pass TDD test suite (>80% coverage)  
✅ CLI commands work in English, Spanish, and French  
✅ Natural language parsing supports all 3 languages  
✅ Output formatting available in all 3 languages  
✅ MCP servers support multilingual queries  
✅ Profile system stores language preference  
✅ Documentation available in all 3 languages  
✅ GitHub Actions CI/CD passing  
✅ All PRs reviewed and merged to main  

---

## 📚 Multilingual Documentation Structure

```
docs/
├── en/
│   ├── README.md
│   ├── HOUSES.md
│   ├── SYNASTRY.md
│   ├── ASTROMAP.md
│   └── SOLAR-RETURNS.md
├── es/
│   ├── LÉAME.md
│   ├── CASAS.md
│   ├── SINASTRÍA.md
│   ├── ASTROMAPA.md
│   └── REVOLUCIONES-SOLARES.md
└── fr/
    ├── LISEZ-MOI.md
    ├── MAISONS.md
    ├── SYNASTRIE.md
    ├── ASTROCARTE.md
    └── RÉVOLUTIONS-SOLAIRES.md
```

---

## 🚀 Updated Rollout Timeline

### Month 1: Infrastructure + Multilingual + House Systems
- **Week 1:** Git setup, Swiss Ephemeris integration
- **Week 2-3:** Multilingual infrastructure (i18n, language detection, Claude integration)
- **Week 4-5:** House Systems feature (TDD cycle) with multilingual support

### Month 2: Synastry (Multilingual)
- **Week 1-5:** Synastry feature with full language support (TDD cycle)

### Month 3: Astrocartography (Multilingual)
- **Week 1-5:** Astrocartography feature with full language support (TDD cycle)

### Month 4: Solar Returns + Final Integration
- **Week 1-4:** Solar Returns feature with full language support (TDD cycle)
- **Week 5:** Final integration testing, multilingual documentation

---

## 🎓 Next Steps After Approval

1. ✅ **Initialize Git repository** in HALCON directory  
2. ✅ **Create GitHub repository** and connect remote  
3. **Install Swiss Ephemeris + i18next packages**  
4. **Create feature branch for multilingual support** (PRIORITY)  
5. **Implement i18n infrastructure** before other features  
6. **Create feature branches** for all 4 astro features  
7. **Start with House Systems** (with multilingual already working)  
8. **Follow TDD workflow** religiously for each feature  

---

**¡Listo para transformar HALCON en una plataforma de astrología de clase mundial con soporte multilingüe! 🌟**

**Prêt à transformer HALCON en une plateforme d'astrologie de classe mondiale avec support multilingue! 🌟**

**Ready to transform HALCON into a world-class astrology platform with multilingual support! 🌟**
