// toc

document.addEventListener("DOMContentLoaded", function () {
  const tocContainer = document.getElementById('toc');
  const sections = document.querySelectorAll('.toc_section');
  const tocList = document.createElement('ul');
  const visibleClass = 'visible';
  let currentLevel = 1;

  // Create the table of contents
  tocList.classList.add('slide-container');
  
  sections.forEach((section) => {
    const tocItem = document.createElement('li');
    tocItem.classList.add('slide-box');

    const headings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length > 0) {
      const tocLink = document.createElement('a');
      tocLink.classList.add('toc-item');
      tocLink.href = `#${section.id}`;
      
      const tocTextSpan = document.createElement('span');
      tocTextSpan.classList.add('toc-txt');
      tocTextSpan.innerText = headings[0] ? headings[0].innerText : section.id;
      tocLink.appendChild(tocTextSpan);

      const bgSlide = document.createElement('div');
      bgSlide.classList.add('bg-slide');
      tocLink.appendChild(bgSlide);

      const progressBar = document.createElement('div');
      progressBar.classList.add('progress-bar');
      tocLink.appendChild(progressBar);

      tocItem.appendChild(tocLink);
      tocList.appendChild(tocItem);

      // Adjust indentation based on heading level
      const headingLevel = parseInt(headings[0].tagName[1]); // h1 => 1, h2 => 2, etc.
      const marginLeft = (headingLevel - 1) * 5 + 10; // 20px per level
      
            
      tocLink.style.marginLeft = `${marginLeft}px`;

      
      // Adjust progress bar width and position based on heading level
      progressBar.style.width = `${marginLeft - 4}px`; // Adjust the width of the progress bar to match the margin of the link
    }
  });

  tocContainer.appendChild(tocList);



  // Function to update the active section and progress bar
  function updateTOC() {
    let scrollPosition = window.scrollY + window.innerHeight;
    let activeIndex = -1;

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      // Mark the active section based on scroll position
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeIndex = index;
      }

      // Update the progress bar for each section
      const progressBar = tocList.querySelectorAll('.progress-bar')[index];
      if (progressBar) {
        const sectionHeight = section.offsetHeight;
        const progress = (scrollPosition - sectionTop) / sectionHeight * 110;
        progressBar.style.height = `${Math.min(Math.max(progress, 0), 110)}%`; // 110% to fill the section
      }

    });

    // Mark the active section in the ToC
    const tocItems = tocList.querySelectorAll('li');
    tocItems.forEach((item, index) => {
      item.classList.toggle('active', index === activeIndex);
    });
  }

  // Listen for scroll events to update ToC and progress bars
  window.addEventListener('scroll', updateTOC);
  updateTOC(); // Initial update when the page loads
});




// Project progress bars
document.addEventListener("DOMContentLoaded", function() {
  const progressBars = document.querySelectorAll(".project-progress-bar-fill");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = parseInt(entry.target.dataset.progress, 10);
        const text = entry.target.nextElementSibling;
        const start = performance.now();
        const duration = 1000;

        function animate(time) {
          const elapsed = time - start;
          const progressValue = Math.min(elapsed / duration, 1);
          const width = progressValue * progress;

          entry.target.style.width = `${width}%`;
          text.style.transform = `translateX(${(1 - progressValue) * 0.5}rem)`;
          text.textContent = `${Math.round(width)}%`;

          if (elapsed < duration) {
            requestAnimationFrame(animate);
          } else {
            text.style.transform = 'translateX(0)';
            observer.unobserve(entry.target);
          }
        }

        requestAnimationFrame(animate);
      }
    });
  }, { threshold: 0.1 });

  progressBars.forEach(bar => {
    observer.observe(bar);
  });
});


(function () {
  const interactiveElements = document.querySelectorAll("a, button, .menu-icon");
  const cursor = document.querySelector(".cursor");
  const specialElements = document.querySelectorAll("textarea, input, .text-area");

  const animateit = function (e) {
    if (this.classList.contains("wiggle")) {
      const { offsetX: x, offsetY: y } = e,
        { offsetWidth: width, offsetHeight: height } = this,
        move = 28,
        xMove = x * (move * 2) / width - move,
        yMove = y * (move * 2) / height - move;
      this.style.transform = `translate(${xMove}px, ${yMove}px)`;
      if (e.type === "mouseleave") {
        this.style.transition = "transform 0.5s ease-in-out";
        this.style.transform = "";
      } else {
        this.style.transition = "transform 0.15s linear";
      }
    }
  };

  const editCursor = (e) => {
    const { clientX: x, clientY: y } = e;
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
  };

  const handleMouseEnter = () => cursor.classList.add("hovered");
  const handleMouseLeave = () => cursor.classList.remove("hovered");

  const eventListener = (e) => {
    if (e.target.classList.contains("wiggle")) {
      animateit(e);
    }
    if (e.type === "mouseenter") {
      handleMouseEnter();
    } else if (e.type === "mouseleave") {
      handleMouseLeave();
    }
    document.removeEventListener(e.type, eventListener);
    document.addEventListener(e.type, eventListener);
  };


  const handleClick = (e) => {
    const href = e.currentTarget.getAttribute("href");
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) return;
    e.preventDefault();
    cursor.classList.add("active");

    const targetSection = document.querySelector(href);
    const scrollDelay = 400;
    const revertDelay = 300;

    let start = null;
    const animation = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = timestamp - start;

      if (progress < scrollDelay) {
        requestAnimationFrame(animation);
      } else {
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
        start = null;
        setTimeout(() => cursor.classList.remove("active"), revertDelay);
      }
    };

    requestAnimationFrame(animation);
  };

  // Attach event listeners
  interactiveElements.forEach((element) => {
    element.addEventListener("click", eventListener);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("click", handleClick);
    element.addEventListener("mousemove", animateit);
    element.addEventListener("mouseleave", animateit);
  });

  document.addEventListener("mousemove", editCursor);
  /* document.body.style.cursor = "none"; */
  document.querySelectorAll('a').forEach(a => a.style.cursor = "none");

  // Button navbar
  window.toggleMenu = function (menuButton) {
    const navLinks = document.querySelector("#navbar .nav-links");
    const isOpen = navLinks.classList.toggle("show");

    if (isOpen) {
      menuButton.classList.add("active");
      handleClickOutside = createHandleClickOutside(navLinks, menuButton);
      document.addEventListener("click", handleClickOutside);

      navLinks.querySelectorAll("li a").forEach((item) => {
        item.addEventListener("click", () => {
          setTimeout(() => closeMenu(navLinks, menuButton), 250);
        });
      });
    } else {
      menuButton.classList.remove("active");
      document.removeEventListener("click", handleClickOutside);
    }
  };

  function createHandleClickOutside(navLinks, menuButton) {
    return function (event) {
      if (!navLinks.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu(navLinks, menuButton);
      }
    };
  }

  function closeMenu(navLinks, menuButton) {
    navLinks.classList.remove("show");
    menuButton.classList.remove("active");
    document.removeEventListener("click", handleClickOutside);
  }

  document.addEventListener("DOMContentLoaded", function () {
  const tocContainer = document.getElementById('toc');
  if (!tocContainer) return;

  // slide effect
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const boxes = document.querySelectorAll(".slide-box");
  const animate = isMobile ? () => {} : (box) => {
    const slide = box.querySelector(".bg-slide");

    const handleMouseEnter = () => slide.style.transform = "translateY(0)";
    const handleMouseLeave = ({ clientY }) => {
      const { top, bottom } = box.getBoundingClientRect();
      slide.style.transform = clientY < top + (bottom - top) / 2 ? "translateY(-100%)" : "translateY(100%)";
    };

    box.addEventListener("mouseenter", handleMouseEnter);
    box.addEventListener("mouseleave", handleMouseLeave);
  };

  boxes.forEach(animate);
});

  boxes.forEach(animate);
})();

