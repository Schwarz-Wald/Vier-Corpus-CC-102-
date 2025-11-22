const menuPage = document.querySelector("div.menu-page");
const directoryPage = document.querySelector("div.directory-page");
const profilePage = document.querySelector("div.profile-page");
const projectsPage = document.querySelector("div.projects-page");
const contentPage = document.querySelector("div.content-page");
const transitionPage = document.querySelector("div.transition-container");
const overlayContainer = document.querySelector(".overlay-container");
const popupContainer = document.querySelector(".popup-container");
if (!menuPage) {
    throw new Error("Menu container not found");
}

const rootElement = document.documentElement;

const smallLogoIcon = document.querySelector(".small-logo-icon");
const colorModeButton = document.querySelector("button.color-mode-container");
const colorModeImg = colorModeButton.querySelector("img");

const guestButton = menuPage.querySelector("button.guest-button");
const adminButton = menuPage.querySelector("button.admin-button");

async function Delay(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

function PreloadImages() {
  const images = [
    'graphics/profile/schwarz-profile.jpg',
    'graphics/profile/elie-profile.png', 
    'graphics/profile/lander-profile.jpg',
    'graphics/profile/angelo-profile.jpg',
    "graphics/profile/default-profile.webp"
  ];

  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

function CheckValidAspectRatio() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  console.log(aspectRatio);

    const pcRatios = [
        { min: 1.5, max: 2.4 },
        { min: 2.5, max: 4.0 }
    ];

  return pcRatios.some(ratio => aspectRatio >= ratio.min && aspectRatio <= ratio.max);
}

if (!CheckValidAspectRatio()) {
  const popupButton = popupContainer.querySelector("button.close-button");
  popupContainer.style.display = "flex";
  popupButton.addEventListener("click", async () => {
    console.log("Popup Clicked!")
    popupContainer.style.animation = "gaga 0.75s ease-in-out";
    await Delay(0.75);
    popupContainer.style.animation = null;
    popupContainer.style.display = "none";
  })
}

PreloadImages();

colorModeButton.addEventListener("click", async () => {
  const colorMode = colorModeButton.getAttribute("data-color");
  const colorModeIcon = colorModeButton.querySelector(".color-mode-button");
  if (colorMode == "light") {
    colorModeIcon.classList.remove("color-mode-slide-left");
    colorModeIcon.classList.add("color-mode-slide-right");
    await Delay(0.49);
    colorModeIcon.style.transform = "translateX(100%)";
    colorModeButton.setAttribute("data-color", "dark");
    SetDarkMode();
  } else {
    colorModeIcon.classList.remove("color-mode-slide-right");
    colorModeIcon.classList.add("color-mode-slide-left");
    await Delay(0.49);
    colorModeIcon.style.transform = "translateX(0%)";
    colorModeButton.setAttribute("data-color", "light");
    SetLightMode();
  }
})

let isDark = false;
function SetDarkMode() {
  isDark = true;
  rootElement.style.setProperty('--background-color', '#1e1e1e');
  rootElement.style.setProperty('--button-color', '#DDDDDE');
  rootElement.style.setProperty('--text-color', '#1A1C25');

  colorModeButton.style.setProperty('--border-color', 'white');
  colorModeButton.style.setProperty('--background-color', 'rgba(62, 62, 62, 0.8)');

  colorModeImg.src = "graphics/svgs/moon-mode.svg";

  overlayContainer.style.setProperty('--background-color', '#1e1e1e');
  overlayContainer.style.setProperty('--text-color', 'white');
  rootElement.style.setProperty('--profile-backdrop', 'rgba(0, 0, 0, 0.33)');

  UpdateProfile();
}

function SetLightMode() {
  rootElement.style.setProperty('--background-color', 'white');
  rootElement.style.setProperty('--button-color', '#2F333F');
  rootElement.style.setProperty('--text-color', 'white');

  colorModeButton.style.setProperty('--border-color', '#D76A71');
  colorModeButton.style.setProperty('--background-color', 'rgba(255, 255, 255, 0.8)');

  colorModeImg.src = "graphics/svgs/sun-mode.svg";

  overlayContainer.style.setProperty('--background-color', 'white');
  overlayContainer.style.setProperty('--text-color', '#454545');
  rootElement.style.setProperty('--profile-backdrop', 'rgba(255, 255, 255, 0.33)');
    
  UpdateProfile();
}

function UpdateProfile() {
    const profilePicture = contentPage.querySelector("div.profile-picture");
    const imgSrc = profilePicture.querySelector("img").src;
    let schwarz = "graphics/profile/schwarz-profile.jpg";
    let variant = "graphics/profile/schwarz-profile-variant.png";
    let isValidUser = (imgSrc === schwarz) || (imgSrc === variant) ? true : false;
    console.log(contentPage.style.display === "flex", isValidUser);
    if (contentPage.style.display === "flex" && isValidUser) {
        let background; let picture; let cellColor;
        
        if (!isDark) {
          background = "linear-gradient(90deg,rgba(204, 88, 110, 1) 0%, rgba(149, 157, 179, 1) 50%, rgba(79, 62, 94, 1) 100%)";
          picture = schwarz;
          cellColor = "#cb5a70";
        } else {
          background = "linear-gradient(90deg,rgba(74, 183, 204, 1) 0%, rgba(114, 125, 145, 1) 50%, rgba(19, 23, 33, 1) 100%)";
          picture = variant;
          cellColor = "#4ab2c7ff";
        }

        const headerContainer = contentPage.querySelector(".header-container");

        headerContainer.style.background = background;
        profilePicture.querySelector(img).src = picture;
        overlayContainer.style.setProperty("--cell-color", cellColor);
    }
}

document.addEventListener('click', async (event) => {
  if (!event.target.classList.value.includes("transition-button")) {
    return;
  }
  transitionPage.style.animation = "transition 1s linear";
  await Delay(1);
  transitionPage.style.animation = null;
})

let activatedMenu = false;
for (const button of [guestButton, adminButton]) {
  if (!button) continue;
  if (!activatedMenu) {
    button.addEventListener("click", async () => {
      await Delay(0.5);
      menuPage.style.display = "none";
      directoryPage.style.display = "flex";
      ActivateDirectory();
    })
    activatedMenu = true;
  }  
}

adminButton.addEventListener("click", async () => {
  console.log("Notif Coming")
  adminButton.style.pointEvents = "none";
  popupContainer.style.backgroundColor = "transparent";
  popupContainer.querySelector(".popup-box").style.display = "none";
  popupContainer.style.display = "flex";
  
  const notification = popupContainer.querySelector(".popup-notification");
  notification.style.display = "flex";
  notification.querySelector("span").textContent = "You are not authorized to access 'Admin Mode'";

  notification.style.animation = "leftSlide 0.5s ease-out";
  await Delay(0.5);
  notification.style.animation = null;
  
  await Delay(2);

  notification.style.animation = "rightSlide 0.5s ease-out";
  await Delay(0.45);
  notification.style.animation = null;
  
  popupContainer.style.display = "none";
  notification.style.display = "none";
  adminButton.style.pointEvents = "all";
})

let activatedDirectory = false;
function ActivateDirectory() {
  const quizButton = directoryPage.querySelector("button.quiz-button");
  const activityButton = directoryPage.querySelector("button.activity-button");
  const projectButton = directoryPage.querySelector("button.project-button");

  smallLogoIcon.style.display = "block";

  if (!activatedDirectory) {
    smallLogoIcon.addEventListener("click", async () => {
      await Delay(0.5);
      directoryPage.style.display = "none";
      menuPage.style.display = "flex";
      smallLogoIcon.style.display = "none";
    });
    for (const button of [quizButton, activityButton, projectButton]) {
      if (!button) continue;
      button.addEventListener("click", () => {
        console.log(button.classList)
        const type = button.getAttribute("data-type");
        if (button.classList.value.includes("project-button")) {
          // ActivateProject();
          ActivateProfile(type);
          return;
        } else {
          ActivateProfile(type);
        }
      })
    }
    activatedDirectory = true;
  }
}

const dirButtonContainer = directoryPage.querySelector(".button-container");

function ClickOut(reset = false) {
  if (reset) {
    profilePage.style.display = "none";
  }
  dirButtonContainer.style.pointerEvents = "all";
  directoryPage.removeEventListener("click", ClickOut);
}

let activatedProfile = false;
let buttonHandlers = new Map();

async function ActivateProfile(type) {
  smallLogoIcon.style.display = "none";
  const users = profilePage.querySelectorAll("button");
  await Delay(0.1);

  directoryPage.addEventListener("click", ClickOut);
  dirButtonContainer.style.pointerEvents = "none";
  directoryPage.style.pointerEvents = "none";

  let userList = ["jonathan", "elie", "lander", "angelo"];
  let exclusionList = [];
  for (const user of userList) {
    const blogs = await FindBlogs(user, type);
    const isEmpty = blogs === null || blogs?.length < 1 ? true : false;
    if (isEmpty) {
      exclusionList.push(user);
    }
  }

  async function ButtonFunctionality(user, type) {
    contentPage.querySelector("div.profile-picture img").src = "graphics/profile/default-profile.webp";
    await Delay(0.5);
    profilePage.style.display = "flex";
    ActivateContent(user, type);
  }

  users.forEach(button => {
    button.parentElement.style.display = "flex"; 
  });

  users.forEach(button => {
    if (buttonHandlers.has(button)) {
      button.removeEventListener("click", buttonHandlers.get(button));
      buttonHandlers.delete(button);
    }
  });

  for (const button of users) {
    const user = button.getAttribute("data-user");
    if (!button) continue;

    if (exclusionList.includes(user)) {
      console.log("Removing", user);
      button.parentElement.style.display = "none";
      continue;
    }

    const handler = async () => {
      await ButtonFunctionality(user, type);
    };

    button.addEventListener("click", handler); 
    buttonHandlers.set(button, handler);
  }

  directoryPage.style.pointerEvents = "all";
  profilePage.style.display = "flex";
  activatedProfile = true;
}

function ActivateProject() {
}

let activatedContent = false;
async function ActivateContent(user, type) {
  const backButton = contentPage.querySelector(".back-button");
  
  smallLogoIcon.style.display = "none";
  backButton.style.display = "block";

  directoryPage.style.display = "none";
  profilePage.style.display = "none";
  contentPage.style.display = "flex";

  const headerContainer = contentPage.querySelector(".header-container");
  const profilePicture = contentPage.querySelector("div.profile-picture");
  const usernameContainer = contentPage.querySelector("span.username");
  const descriptionContainer = contentPage.querySelector("span.description");
  const blockContainer = contentPage.querySelector(".block-container");

  // Profile Header Contents

  function GetUserInfo(user) {
    let background = null; let cellColor = null;
    let picture = null;
    let username = ''; let nickname = '';
    let description = '';
    let blogTitle = '';
    switch (user) {
      case "jonathan":
        if (!isDark) {
          background = "linear-gradient(90deg,rgba(204, 88, 110, 1) 0%, rgba(149, 157, 179, 1) 50%, rgba(79, 62, 94, 1) 100%)";
          picture = "graphics/profile/schwarz-profile.jpg";
          cellColor = "#cb5a70";
        } else {
          background = "linear-gradient(90deg,rgba(74, 183, 204, 1) 0%, rgba(114, 125, 145, 1) 50%, rgba(19, 23, 33, 1) 100%)";
          picture = "graphics/profile/schwarz-profile-variant.png";
          cellColor = "#4ab2c7ff";
        }
        icon = "graphics/icons/schwarz-white.svg";
        username = "Schwarzwald";
        nickname = "Jonathan C.";
        description = "Formerly Grievous——presently a Faithful Endorser;\nA student who's interested in making all sorts of things for fun;\nSlightly sentimental and part-ways delusional.";
        break;
      case "elie":
        background = "linear-gradient(360deg, rgba(253, 81, 29, 1) 0%, rgba(252, 176, 69, 1) 100%)";
        picture = "graphics/profile/elie-profile.png";
        icon = "graphics/icons/elie-white.svg";
        username = "Eleanor";
        nickname = "Elie C.";
        description = "Showcasing a quiet demeanor, what lies beneath is an array of skills and imagination that remained bottled.\nA student with an overwhelming sense of curiosity and a keen thirst for knowledge.\n——No matter how difficult it is attain.";
        cellColor = "#fd6d29";
        blogTitle = "";
        break;
      case "lander":
        background = "linear-gradient(90deg,rgba(39, 126, 161, 1) 0%, rgba(17, 214, 99, 1) 50%, rgba(237, 221, 83, 1) 100%)";
        picture = "graphics/profile/lander-profile.jpg";
        icon = "graphics/icons/lander-white.svg";
        username = "Jungkick";
        nickname = "Lander C.";
        description = "A jolly student whose hobby is making people happy.\nI also sing and like fashion.\nBut when it comes to school, haha no comment.";
        cellColor = "#1bd662";
        blogTitle = "";
        break;
      case "angelo":
        background = "linear-gradient(0deg, rgba(18, 218, 222, 1) 0%, rgba(65, 127, 209, 1) 100%)";
        picture = "graphics/profile/angelo-profile.jpg";
        icon = "graphics/icons/angelo-white.svg";
        username = "Gelo";
        nickname = "Angelo N.";
        description = "A shy but softhearted student who loves gaming and listening to people’s stories. I enjoy making others feel heard, even if I’m not the most confident. I value memories, care deeply, and learn from every experience even the tough ones";
        cellColor = "#5bb5fd";
        blogTitle = "";
        break;
    }
    return {
      background: background,
      picture: picture,
      icon: icon,
      username: username,
      nickname: nickname,
      description: description,
      cellColor: cellColor
    }
  }

  const userInfo = GetUserInfo(user);
  
  headerContainer.style.background = userInfo.background;
  contentPage.style.setProperty("--cell-color", userInfo.cellColor);
  overlayContainer.style.setProperty("--cell-color", userInfo.cellColor);
  blockContainer.style.setProperty("--scroll-background", userInfo.background);
  profilePicture.querySelector("img").src = userInfo.picture;

  const main = usernameContainer.querySelector(".main");
  if (usernameContainer.querySelector(".main")) {
    const sub = usernameContainer.querySelector(".sub");
    main.textContent = userInfo.username;
    sub.textContent =userInfo. nickname;
  } 
  else {
    usernameContainer.textContent = userInfo.username;
  }

  descriptionContainer.textContent = userInfo.description;

  function CenterScroll(blockContainer) {
    blockContainer.scrollLeft = 0;
    console.log("Starting Scroll", blockContainer.scrollLeft);

    const targetScroll = (blockContainer.scrollWidth - blockContainer.clientWidth) / 2;

    blockContainer.scrollLeft = targetScroll;

    console.log("Ending Scroll", blockContainer.scrollLeft);
  }

  function CenterScrollContainer(blockContainer) {
    const bodyContainer = document.querySelector('.body-container');

    blockContainer.style.margin = '0';

    console.log(blockContainer.scrollWidth, bodyContainer.clientWidth);

    if (blockContainer.scrollWidth <= bodyContainer.clientWidth) {
      console.log("Setting Body to Center")
      bodyContainer.style.alignItems = "center";
    } else {
      console.log("Setting Body to None")
      bodyContainer.style.alignItems = "unset";
    }
  }

  // Interactions

  const navigationContainer = contentPage.querySelector(".navigation-container");
  let exclusionList = ["jonathan", "elie", "lander", "angelo"];
  exclusionList = exclusionList.filter(item => item !== user.trim());

  const navButtons = Array.from(navigationContainer.querySelectorAll("button.navigation-button"));

  for (let i = 0; i < navButtons.length && i < exclusionList.length; i++) {
    const button = navButtons[i];
    const targetUser = exclusionList[i];

    const blogs = await FindBlogs(targetUser, type);
    const isEmpty = blogs === null || blogs.length < 1 ? true : false;
    console.log(isEmpty, targetUser, type, blogs);

    if (isEmpty) {
      button.style.pointerEvents = "none";
      button.style.opacity = "50%";
      continue;
    }

    button.setAttribute("data-shuffle", targetUser.trim());
    button.querySelector("img").src = GetUserInfo(targetUser).icon;

    if (!activatedContent) {
      button.addEventListener("click", async () => {
        const shuffleUser = button.getAttribute("data-shuffle");
        contentPage.querySelector("div.profile-picture img").src = "graphics/profile/default-profile.webp";
        await Delay(0.5);
        console.log("Activating", shuffleUser);
        ActivateContent(shuffleUser, type);
      });
    }
  }

  if (!activatedContent) {
    let isScrolling = false;

    blockContainer.addEventListener('wheel', (event) => {
      if (isScrolling) return;

      event.preventDefault();
      isScrolling = true;

      blockContainer.scrollLeft += event.deltaY * 2 * (blockContainer.clientWidth / 2);

      setTimeout(() => {
        isScrolling = false;
      }, 150);
    });

    profilePicture.querySelector("img").addEventListener("click", async () => {
      console.log("Triggering Animation!");
      profilePicture.classList.add("click-profile");
      await Delay(1.6);
      profilePicture.classList.remove("click-profile");
    })

    backButton.addEventListener("click", async () => {
      await Delay(0.5);
      contentPage.style.display = "none";
      directoryPage.style.display = "flex";
      ClickOut(false);
      ActivateDirectory();
    })
    activatedContent = true;
  }

  await InstantiateBlogs(user, type);
  
  await Delay(0.1);
  
  CenterScrollContainer(blockContainer);
  CenterScroll(blockContainer);
}

// Blog Pasting

async function FetchBlogs(user) {
  try {
    const response = await fetch('./blogs.json');
    const data = await response.json();
    return data.filter((b) => b.user === user);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
}

async function FindBlogs(user, type) {
  const blogs = await FetchBlogs(user);
  const userData = blogs.find(u => u.user === user);
  if (userData) {
    return filteredBlogs = userData.blogs.filter((b) => b.type === type);
  } else {
    return null;
  }
}

async function InstantiateBlogs(user, type = "project") {
  const filteredBlogs = await FindBlogs(user, type);

  function ScaleText(element) {
    const container = element.parentElement;
    if (!container) return;

    let fontSize = 70;
    element.style.fontSize = "4.35rem"

    while (element.scrollWidth > container.clientWidth && fontSize > 8) {
      fontSize -= 2.5;
      element.style.fontSize = fontSize + 'px';
    }
  }

  function ScaleImage(element, scale) {
    if (!element.complete || element.naturalHeight === 0) {
        element.onload = function() {
            ScaleImage(element);
        };
        return;
    }
    
    element.style.transform = `scale(${scale})`;
    element.style.transformOrigin = 'center center';

  }

  const blockContainer = contentPage.querySelector(".block-container");
  blockContainer.innerHTML = '';

  for (let i = 0; i < filteredBlogs.length; i++) {
    const blog = filteredBlogs[i];
    const blogTemplate = document.querySelector("template[value='blog-cell']").content.cloneNode(true);

    const blogCell = blogTemplate.querySelector(".blog-cell");
    const blogTitle = blogTemplate.querySelector("span.blogTitle");
    const thumbnailImg = blogTemplate.querySelector("img.thumbnail");

    if (blogCell && blogTitle && thumbnailImg) {
      thumbnailImg.src = blog.image;
      if (blog.offset) {
        thumbnailImg.style.bottom = blog.offset[0] + "%";
        thumbnailImg.style.left = blog.offset[1] + "%";
      }
      blogTitle.textContent = blog.title;

      blockContainer.appendChild(blogTemplate);

      requestAnimationFrame(() => {
        if (blog.scale) {
          ScaleImage(thumbnailImg, blog.scale);
        }
        ScaleText(blogTitle);
      });
    }

    blogCell.addEventListener("click", async () => {
      console.log("Hello World!");
      overlayContainer.classList.add("gogo");
      await Delay(0.65);
      overlayContainer.style.opacity = 1;
      overlayContainer.style.pointerEvents = "all";

      overlayContainer.classList.remove("gogo");
      
      console.log("Blog Clicked", blog);
      ActivateOverlay(blog);
    })
  }
}

let activatedOverlay = false;
function ActivateOverlay(blog) {
  const blogContainer = overlayContainer.querySelector(".blog-container");
  const textContainer = overlayContainer.querySelector(".text-container");
  const titleContainer = textContainer.querySelector(".title");
  const descriptionContainer = textContainer.querySelector(".description");
  const profilePicture = overlayContainer.querySelector(".profile-picture");
  const footerContainer = overlayContainer.querySelector(".footer-container");

  function ScaleText(element) {
    const container = element.parentElement;
    if (!container) return;

    let fontSize = 80;
    element.style.fontSize = "4.35rem"

    while (element.scrollWidth > container.clientWidth && fontSize > 8) {
      fontSize -= 2.5;
      element.style.fontSize = fontSize + 'px';
    }
  }

  blogContainer.querySelector("img").src = blog.image;
  profilePicture.src = contentPage.querySelector("div.profile-picture img").src;
  titleContainer.textContent = blog.title;
  ScaleText(titleContainer);
  descriptionContainer.textContent = blog.description;
  footerContainer.style.background = contentPage.style.getPropertyValue("--cell-color");
  
  if (!activatedOverlay) {
    overlayContainer.addEventListener("click", async () => {
      console.log("Bye World!");
      overlayContainer.classList.add("gaga");
      
      await Delay(0.65);
      overlayContainer.style.pointerEvents = "none";
      overlayContainer.style.opacity = 0;
      
      overlayContainer.classList.remove("gaga");
    })
  }
}
