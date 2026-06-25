# 🟡 Caçambas Volta Redonda — Site Institucional

> **Status: ✅ Pronto para Produção**  
> Site de aluguel de caçambas de entulho em Volta Redonda - RJ, otimizado para SEO local e performance máxima.

---

## 🚀 Sobre o Projeto

Site institucional desenvolvido para a empresa **Caçambas Volta Redonda**, líder no aluguel de caçambas de entulho na cidade de Volta Redonda - RJ. O projeto foi construído com foco em:

- 📈 **SEO Local** — Páginas dedicadas para cada bairro de Volta Redonda (70+ páginas indexáveis)
- ⚡ **Performance** — Score Lighthouse 89/100 em produção
- ♿ **Acessibilidade** — Score Lighthouse 98/100
- 🔍 **SEO Técnico** — Score Lighthouse 100/100
- 📱 **Responsividade** — Layout otimizado para mobile, tablet e desktop

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [Astro](https://astro.build) | ^4.16 | Framework SSG/SSR principal |
| [Tailwind CSS](https://tailwindcss.com) | ^3.4 | Estilização utility-first |
| [TypeScript](https://typescriptlang.org) | — | Tipagem estática |
| [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | ^3.5 | Geração automática de sitemap |
| [@astrojs/vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/) | latest | Adapter de deploy na Vercel |

---

## 📁 Estrutura do Projeto

```
/
├── public/                   # Assets estáticos (favicon, imagens públicas)
├── src/
│   ├── assets/               # Imagens otimizadas (WebP)
│   ├── components/           # Componentes reutilizáveis (.astro)
│   │   ├── SEO.astro         # Meta tags e Open Graph
│   │   ├── SchemaLocalBusiness.astro  # Schema.org para SEO local
│   │   └── WhatsAppBtn.astro # Botão flutuante WhatsApp
│   ├── content/
│   │   ├── bairros/          # 70+ páginas de bairros (Markdown)
│   │   ├── servicos/         # Páginas de serviços (caçambas 4m³, 5m³, 7m³)
│   │   └── blog/             # Artigos de blog
│   ├── data/
│   │   └── config.ts         # Configurações globais do site
│   ├── layouts/
│   │   └── Layout.astro      # Layout principal com header e footer
│   ├── pages/                # Rotas do site
│   └── styles/
│       └── global.css        # Estilos globais
├── astro.config.mjs          # Configuração do Astro + Vercel
├── tailwind.config.mjs       # Configuração do Tailwind
└── package.json
```

---

## ⚙️ Comandos

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (http://localhost:4321)
npm run dev

# Build de produção
npm run build

# Visualizar build de produção localmente
npm run preview
```

---

## 🌐 Deploy na Vercel

O projeto está configurado para deploy automático na **Vercel** via adaptador `@astrojs/vercel`.

### Passos para deploy:
1. Faça push do projeto para um repositório no **GitHub**
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. A Vercel detectará automaticamente o Astro e configurará o build
4. Configure o domínio `cacambasvoltaredonda.com.br` nas configurações do projeto

### Variáveis de Ambiente
Nenhuma variável de ambiente é necessária. Todas as configurações estão em `src/data/config.ts`.

---

## 📊 Métricas de Performance (Lighthouse — Produção)

| Métrica | Score |
|---|---|
| ⚡ Performance | **89/100** |
| ♿ Acessibilidade | **98/100** |
| ✅ Boas Práticas | **100/100** |
| 🔍 SEO | **100/100** |

| Vitals | Valor |
|---|---|
| First Contentful Paint | **2.6s** |
| Largest Contentful Paint | **3.3s** |
| Time to Interactive | **3.3s** |
| Total Blocking Time | **0ms** |

---

## 🏢 Informações da Empresa

- **Empresa:** Caçambas Volta Redonda
- **Licença SMMA:** L.O. nº 0387/24
- **Registro ATT:** ATT-VR nº 092/24
- **Endereço:** Av. Amaral Peixoto, 533 - Centro, Volta Redonda - RJ
- **WhatsApp:** [(24) 96058-4747](https://wa.me/5524960584747)

---

## 📄 Licença

Projeto privado — todos os direitos reservados à **Caçambas Volta Redonda**.
