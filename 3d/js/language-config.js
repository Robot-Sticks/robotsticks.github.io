// language
function setLanguage(language) {
    const translations = {
      en: {
        welcomeMessage: "Welcome to Palitos.XYZ!",
        platformDescription: "Try our platform for building educational projects with Popsicle stick 3D models to inspire children around the world to make projects with real wooden sticks.",
        startBuildingButton: "Start Building",
        copyrightMessage: "&copy; LCE.toys 2023",
      },
      fr: {
        welcomeMessage: "Bienvenue sur Palitos.XYZ !",
        platformDescription: "Essayez notre plateforme pour construire des projets éducatifs avec des modèles 3D en bâtonnets de glace pour inspirer les enfants du monde entier à réaliser des projets avec de vrais bâtonnets en bois.",
        startBuildingButton: "Commencer la construction",
        copyrightMessage: "&copy; LCE.toys 2023",
      },
      pt: {
        welcomeMessage: "Bem-vindo ao Palitos.XYZ!",
        platformDescription: "Experimente nossa plataforma para construir projetos educacionais com modelos 3D de palitos de picolé para inspirar crianças ao redor do mundo a fazer projetos com palitos de madeira reais.",
        startBuildingButton: "Começar a construir",
        copyrightMessage: "&copy; LCE.toys 2023",
      },
      de: {
        welcomeMessage: "Willkommen bei Palitos.XYZ!",
        platformDescription: "Probieren Sie unsere Plattform zum Bau von Bildungsprojekten mit 3D-Modellen aus Eis am Stiel, um Kinder auf der ganzen Welt zu inspirieren, Projekte mit echten Holzstäben zu gestalten.",
        startBuildingButton: "Starten Sie den Bau",
        copyrightMessage: "&copy; LCE.toys 2023",
      },
      es: {
        welcomeMessage: "¡Bienvenido a Palitos.XYZ!",
        platformDescription: "Pruebe nuestra plataforma para construir proyectos educativos con modelos 3D de palitos de helado para inspirar a los niños de todo el mundo a hacer proyectos con palitos de madera reales.",
        startBuildingButton: "Comenzar a construir",
        copyrightMessage: "&copy; LCE.toys 2023",
      },
    };
    document.getElementById("welcome-message").textContent = translations[language].welcomeMessage;
    document.getElementById("platform-description").textContent = translations[language].platformDescription;
    document.getElementById("start-building-button").textContent = translations[language].startBuildingButton;
    document.getElementById("copyright-message").innerHTML = translations[language].copyrightMessage;
  }
  // Adicione um ouvinte de evento para detectar alterações na seleção do idioma
  document.getElementById("language-selector").addEventListener("change", function () {
    const selectedLanguage = this.value;
    setLanguage(selectedLanguage);
  });