document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  if (!header) return;
  function handleHeader() {
    if (window.scrollY >= 150) {
      header.classList.add("sticky-header");
    } else {
      header.classList.remove("sticky-header");
    }
  }
  handleHeader();
  window.addEventListener("scroll", handleHeader, {
    passive: true,
  });
});

document.addEventListener("DOMContentLoaded", function () {
  /* =========================================
       ELEMENTS
    ========================================= */
  const form = document.getElementById("projectForm");
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const companyName = document.getElementById("companyName");
  const serviceProduct = document.getElementById("serviceProduct");
  const projectDetails = document.getElementById("projectDetails");
  const budget = document.getElementById("budget");
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const resendOtpBtn = document.getElementById("resendOtpBtn");
  const otpVerification = document.getElementById("otpVerification");
  const otpInput = document.getElementById("otp");
  const otpVerified = document.getElementById("otpVerified");
  const projectSubmitBtn = document.getElementById("projectSubmitBtn");
  const otpError = document.getElementById("otpError");
  const otpSuccess = document.getElementById("otpSuccess");
  const uploadYes = document.getElementById("uploadYes");
  const uploadNo = document.getElementById("uploadNo");
  const attachmentSection = document.getElementById("attachmentSection");
  const attachment = document.getElementById("attachment");
  const formStatus = document.getElementById("formStatus");
  /* =========================================
       OTP VARIABLES
    ========================================= */
  let generatedOTP = null;
  let otpTimer = null;
  let resendSeconds = 60;
  /* =========================================
       EMAIL VALIDATION
    ========================================= */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  /* =========================================
       SEND OTP
    ========================================= */
  sendOtpBtn.addEventListener("click", function () {
    const emailValue = email.value.trim();
    const emailError = document.getElementById("emailError");
    emailError.textContent = "";
    otpError.textContent = "";
    otpSuccess.textContent = "";
    if (!emailValue) {
      emailError.textContent = "Please enter your email address.";
      email.focus();
      return;
    }
    if (!isValidEmail(emailValue)) {
      emailError.textContent = "Please enter a valid email address.";
      email.focus();
      return;
    }
    /*
     * DEMO OTP
     *
     * For production, this OTP must be generated
     * and sent from your backend/email service.
     */
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Demo OTP:", generatedOTP);
    /* SHOW OTP AREA */
    otpVerification.hidden = false;
    otpInput.disabled = false;
    verifyOtpBtn.disabled = false;
    otpInput.value = "";
    otpInput.focus();
    otpVerified.value = "false";
    projectSubmitBtn.disabled = true;
    otpSuccess.textContent = "OTP has been sent to your email.";
    /* START TIMER */
    startOtpTimer();
  });
  /* =========================================
       VERIFY OTP
    ========================================= */
  verifyOtpBtn.addEventListener("click", function () {
    const enteredOTP = otpInput.value.trim();
    otpError.textContent = "";
    otpSuccess.textContent = "";
    if (!enteredOTP) {
      otpError.textContent = "Please enter the OTP.";
      otpInput.focus();
      return;
    }
    if (!/^\d{6}$/.test(enteredOTP)) {
      otpError.textContent = "OTP must contain 6 digits.";
      otpInput.focus();
      return;
    }
    if (enteredOTP !== generatedOTP) {
      otpError.textContent = "Invalid OTP. Please try again.";
      otpVerified.value = "false";
      projectSubmitBtn.disabled = true;
      return;
    }
    /* OTP VERIFIED */
    otpVerified.value = "true";
    otpSuccess.textContent = "Email verified successfully.";
    otpError.textContent = "";
    otpInput.disabled = true;
    verifyOtpBtn.disabled = true;
    sendOtpBtn.disabled = true;
    clearInterval(otpTimer);
    /* ENABLE SUBMIT */
    updateSubmitButton();
  });

  /* =========================================
       RESEND OTP
    ========================================= */
  resendOtpBtn.addEventListener("click", function () {
    sendOtpBtn.disabled = false;

    sendOtpBtn.click();
  });
  /* =========================================
       OTP TIMER
    ========================================= */
  function startOtpTimer() {
    clearInterval(otpTimer);
    resendSeconds = 60;
    resendOtpBtn.hidden = true;
    otpSuccess.textContent = "OTP sent. You can resend after 60 seconds.";
    otpTimer = setInterval(function () {
      resendSeconds--;
      if (resendSeconds <= 0) {
        clearInterval(otpTimer);
        resendOtpBtn.hidden = false;
        otpSuccess.textContent = "You can resend the OTP now.";
      } else {
        otpSuccess.textContent =
          "OTP sent. Resend in " + resendSeconds + " seconds.";
      }
    }, 1000);
  }
  /* =========================================
       FILE UPLOAD YES / NO
    ========================================= */
  uploadYes.addEventListener("change", function () {
    if (uploadYes.checked) {
      attachmentSection.hidden = false;
    }
  });

  uploadNo.addEventListener("change", function () {
    if (uploadNo.checked) {
      attachmentSection.hidden = true;
      attachment.value = "";
      document.getElementById("attachmentError").textContent = "";
    }
  });
  /* =========================================
       REQUIRED FIELD CHECK
    ========================================= */
  function checkRequiredFields() {
    return (
      fullName.value.trim() !== "" &&
      email.value.trim() !== "" &&
      phone.value.trim() !== "" &&
      companyName.value.trim() !== "" &&
      serviceProduct.value !== "" &&
      projectDetails.value.trim() !== "" &&
      budget.value !== "" &&
      otpVerified.value === "true"
    );
  }
  /* =========================================
       SUBMIT BUTTON STATE
    ========================================= */
  function updateSubmitButton() {
    if (checkRequiredFields()) {
      projectSubmitBtn.disabled = false;
    } else {
      projectSubmitBtn.disabled = true;
    }
  }
  /* =========================================
       LIVE FORM CHECK
    ========================================= */
  const formFields = [
    fullName,
    email,
    phone,
    companyName,
    serviceProduct,
    projectDetails,
    budget,
  ];
  formFields.forEach(function (field) {
    field.addEventListener("input", function () {
      updateSubmitButton();
    });
    field.addEventListener("change", function () {
      updateSubmitButton();
    });
  });
  /* =========================================
       OTP INPUT ONLY NUMBERS
    ========================================= */
  otpInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 6);
  });
  /* =========================================
       FORM SUBMIT
    ========================================= */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    formStatus.textContent = "";
    formStatus.className = "form-status";
    /* OTP CHECK */
    if (otpVerified.value !== "true") {
      formStatus.textContent = "Please verify your email before submitting.";
      formStatus.classList.add("error");
      return;
    }
    /* BASIC VALIDATION */
    if (!checkRequiredFields()) {
      formStatus.textContent = "Please complete all required fields.";
      formStatus.classList.add("error");
      return;
    }
    /* FILE VALIDATION */
    if (uploadYes.checked && !attachment.files.length) {
      document.getElementById("attachmentError").textContent =
        "Please upload an attachment.";
      attachment.focus();
      return;
    }
    formStatus.textContent =
      "Your project request has been submitted successfully.";
    formStatus.classList.add("success");
    console.log("Form data ready to submit:", new FormData(form));
  });
  /* =========================================
       INITIAL STATE
    ========================================= */
  attachmentSection.hidden = true;
  otpVerification.hidden = true;
  projectSubmitBtn.disabled = true;
});
document.addEventListener("DOMContentLoaded", function () {
  /* =========================================
       PRODUCT IMAGE SLIDER
    ========================================= */
  const mainImage = document.getElementById("productMainImage");
  const thumbnailViewport = document.querySelector(".thumbnail-viewport");
  const thumbnailTrack = document.querySelector(".thumbnail-track");
  const thumbnails = document.querySelectorAll(".product-thumb");
  const prevButton = document.querySelector(".thumbnail-prev");
  const nextButton = document.querySelector(".thumbnail-next");
  let currentThumb = 0;
  let thumbPosition = 0;
  /* =========================================
       INITIAL ACTIVE THUMBNAIL
    ========================================= */
  const existingActive = document.querySelector(".product-thumb.active");
  if (existingActive) {
    const activeIndex = Array.from(thumbnails).indexOf(existingActive);
    if (activeIndex >= 0) {
      currentThumb = activeIndex;
    }
  }
  /* =========================================
       UPDATE PREV / NEXT BUTTON
    ========================================= */
  function updateThumbnailArrows() {
    if (!prevButton || !nextButton) {
      return;
    }
    /* ---------- PREVIOUS ---------- */
    if (currentThumb <= 0) {
      prevButton.classList.remove("is-active");
      prevButton.classList.add("is-disabled");
    } else {
      prevButton.classList.remove("is-disabled");
      prevButton.classList.add("is-active");
    }
    /* ---------- NEXT ---------- */
    if (currentThumb >= thumbnails.length - 1) {
      nextButton.classList.remove("is-active");
      nextButton.classList.add("is-disabled");
    } else {
      nextButton.classList.remove("is-disabled");
      nextButton.classList.add("is-active");
    }
  }
  /* =========================================
       CHANGE MAIN IMAGE
    ========================================= */
  function changeProductImage(index) {
    if (!thumbnails.length || !mainImage) {
      return;
    }
    /* Prevent below 0 */
    if (index < 0) {
      index = 0;
    }
    /* Prevent beyond last image */
    if (index >= thumbnails.length) {
      index = thumbnails.length - 1;
    }
    currentThumb = index;
    const selectedThumb = thumbnails[index];
    const imagePath = selectedThumb.getAttribute("data-image");
    /* Change main image */
    if (imagePath) {
      mainImage.src = imagePath;
    }
    /* Remove active */
    thumbnails.forEach(function (thumb) {
      thumb.classList.remove("active");
    });
    /* Add active */
    selectedThumb.classList.add("active");
    /* Move thumbnail slider */
    moveThumbnailSlider(index);
    /* Update arrow background */
    updateThumbnailArrows();
  }
  /* =========================================
       MOVE THUMBNAIL TRACK
    ========================================= */
  function moveThumbnailSlider(index) {
    if (!thumbnailViewport || !thumbnailTrack) {
      return;
    }
    const selectedThumb = thumbnails[index];
    if (!selectedThumb) {
      return;
    }
    const viewportWidth = thumbnailViewport.offsetWidth;
    const thumbLeft = selectedThumb.offsetLeft;
    const thumbWidth = selectedThumb.offsetWidth;
    const currentPosition = Math.abs(thumbPosition);
    const thumbRight = thumbLeft + thumbWidth;
    const visibleRight = currentPosition + viewportWidth;
    /* =====================================
           MOVE RIGHT
        ==================================== */
    if (thumbRight > visibleRight) {
      thumbPosition = -(thumbRight - viewportWidth);
    }
    /* =====================================
           MOVE LEFT
        ===================================== */
    if (thumbLeft < currentPosition) {
      thumbPosition = -thumbLeft;
    }
    /* =====================================
           DON'T MOVE BEYOND BEGINNING
        ===================================== */
    if (thumbPosition > 0) {
      thumbPosition = 0;
    }
    /* =====================================
           DON'T MOVE BEYOND END
        ===================================== */
    const maxPosition = Math.max(
      0,
      thumbnailTrack.scrollWidth - thumbnailViewport.offsetWidth,
    );
    if (Math.abs(thumbPosition) > maxPosition) {
      thumbPosition = -maxPosition;
    }
    /* Apply movement */
    thumbnailTrack.style.transform = "translateX(" + thumbPosition + "px)";
  }
  /* =========================================
       THUMBNAIL CLICK
    ========================================= */
  thumbnails.forEach(function (thumb, index) {
    thumb.addEventListener("click", function () {
      changeProductImage(index);
    });
  });
  /* =========================================
       PREVIOUS BUTTON
    ========================================= */
  if (prevButton) {
    prevButton.addEventListener("click", function () {
      if (currentThumb > 0) {
        changeProductImage(currentThumb - 1);
      }
    });
  }
  /* =========================================
       NEXT BUTTON
    ========================================= */
  if (nextButton) {
    nextButton.addEventListener("click", function () {
      if (currentThumb < thumbnails.length - 1) {
        changeProductImage(currentThumb + 1);
      }
    });
  }
  /* =========================================
       RESIZE
    ========================================= */
  window.addEventListener("resize", function () {
    moveThumbnailSlider(currentThumb);
    updateThumbnailArrows();
  });
  /* =========================================
       INITIAL SETUP
    ========================================= */
  updateThumbnailArrows();
  moveThumbnailSlider(currentThumb);
  /* =========================================
       PRODUCT TABS
    ========================================= */
  const tabs = document.querySelectorAll(".product-tab");
  const tabContents = document.querySelectorAll(".product-tab-content");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const target = tab.getAttribute("data-tab");
      /* Remove active from buttons */
      tabs.forEach(function (item) {
        item.classList.remove("active");
      });
      /* Remove active from content */
      tabContents.forEach(function (content) {
        content.classList.remove("active");
      });
      /* Active clicked button */
      tab.classList.add("active");
      /* Active matching content */
      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  /* =========================================
       PRODUCT IMAGE SLIDER
    ========================================= */
  const mainImage = document.getElementById("productMainImage");
  const thumbnailViewport = document.querySelector(".thumbnail-viewport");
  const thumbnailTrack = document.querySelector(".thumbnail-track");
  const thumbnails = document.querySelectorAll(".product-thumb");
  const prevButton = document.querySelector(".thumbnail-prev");
  const nextButton = document.querySelector(".thumbnail-next");
  let currentThumb = 0;
  let thumbPosition = 0;
  /* =========================================
       INITIAL ACTIVE THUMBNAIL
    ========================================= */
  const existingActive = document.querySelector(".product-thumb.active");
  if (existingActive) {
    const activeIndex = Array.from(thumbnails).indexOf(existingActive);
    if (activeIndex >= 0) {
      currentThumb = activeIndex;
    }
  }
  /* =========================================
       UPDATE PREV / NEXT BUTTON
    ========================================= */
  function updateThumbnailArrows() {
    if (!prevButton || !nextButton) {
      return;
    }
    /* ---------- PREVIOUS ---------- */
    if (currentThumb <= 0) {
      prevButton.classList.remove("is-active");
      prevButton.classList.add("is-disabled");
    } else {
      prevButton.classList.remove("is-disabled");
      prevButton.classList.add("is-active");
    }
    /* ---------- NEXT ---------- */

    if (currentThumb >= thumbnails.length - 1) {
      nextButton.classList.remove("is-active");
      nextButton.classList.add("is-disabled");
    } else {
      nextButton.classList.remove("is-disabled");
      nextButton.classList.add("is-active");
    }
  }
  /* =========================================
       CHANGE MAIN IMAGE
    ========================================= */

  function changeProductImage(index) {
    if (!thumbnails.length || !mainImage) {
      return;
    }
    /* Prevent below 0 */
    if (index < 0) {
      index = 0;
    }
    /* Prevent beyond last image */
    if (index >= thumbnails.length) {
      index = thumbnails.length - 1;
    }
    currentThumb = index;
    const selectedThumb = thumbnails[index];
    const imagePath = selectedThumb.getAttribute("data-image");
    /* Change main image */
    if (imagePath) {
      mainImage.src = imagePath;
    }
    /* Remove active */
    thumbnails.forEach(function (thumb) {
      thumb.classList.remove("active");
    });
    /* Add active */
    selectedThumb.classList.add("active");
    /* Move thumbnail slider */
    moveThumbnailSlider(index);
    /* Update arrow background */
    updateThumbnailArrows();
  }
  /* =========================================
       MOVE THUMBNAIL TRACK
    ========================================= */
  function moveThumbnailSlider(index) {
    if (!thumbnailViewport || !thumbnailTrack) {
      return;
    }
    const selectedThumb = thumbnails[index];
    if (!selectedThumb) {
      return;
    }
    const viewportWidth = thumbnailViewport.offsetWidth;
    const thumbLeft = selectedThumb.offsetLeft;
    const thumbWidth = selectedThumb.offsetWidth;
    const currentPosition = Math.abs(thumbPosition);
    const thumbRight = thumbLeft + thumbWidth;
    const visibleRight = currentPosition + viewportWidth;
    /* =====================================
           MOVE RIGHT
        ==================================== */
    if (thumbRight > visibleRight) {
      thumbPosition = -(thumbRight - viewportWidth);
    }
    /* =====================================
           MOVE LEFT
        ===================================== */
    if (thumbLeft < currentPosition) {
      thumbPosition = -thumbLeft;
    }
    /* =====================================
           DON'T MOVE BEYOND BEGINNING
        ===================================== */
    if (thumbPosition > 0) {
      thumbPosition = 0;
    }
    /* =====================================
           DON'T MOVE BEYOND END
        ===================================== */
    const maxPosition = Math.max(
      0,
      thumbnailTrack.scrollWidth - thumbnailViewport.offsetWidth,
    );
    if (Math.abs(thumbPosition) > maxPosition) {
      thumbPosition = -maxPosition;
    }
    /* Apply movement */
    thumbnailTrack.style.transform = "translateX(" + thumbPosition + "px)";
  }
  /* =========================================
       THUMBNAIL CLICK
    ========================================= */
  thumbnails.forEach(function (thumb, index) {
    thumb.addEventListener("click", function () {
      changeProductImage(index);
    });
  });
  /* =========================================
       PREVIOUS BUTTON
    ========================================= */
  if (prevButton) {
    prevButton.addEventListener("click", function () {
      if (currentThumb > 0) {
        changeProductImage(currentThumb - 1);
      }
    });
  }
  /* =========================================
       NEXT BUTTON
    ========================================= */
  if (nextButton) {
    nextButton.addEventListener("click", function () {
      if (currentThumb < thumbnails.length - 1) {
        changeProductImage(currentThumb + 1);
      }
    });
  }
  /* =========================================
       RESIZE
    ========================================= */
  window.addEventListener("resize", function () {
    moveThumbnailSlider(currentThumb);
    updateThumbnailArrows();
  });
  /* =========================================
       INITIAL SETUP
    ========================================= */
  updateThumbnailArrows();
  moveThumbnailSlider(currentThumb);
  /* =========================================
       PRODUCT TABS
    ========================================= */

  const tabs = document.querySelectorAll(".product-tab");
  const tabContents = document.querySelectorAll(".product-tab-content");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const target = tab.getAttribute("data-tab");
      /* Remove active from buttons */
      tabs.forEach(function (item) {
        item.classList.remove("active");
      });
      /* Remove active from content */
      tabContents.forEach(function (content) {
        content.classList.remove("active");
      });
      /* Active clicked button */
      tab.classList.add("active");
      /* Active matching content */
      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
});

/* ================= language_change 
===================== */
document.addEventListener("DOMContentLoaded", function () {
    const languageSwitcher = document.querySelector(".language-switcher");
    const languageBtn = document.getElementById("languageBtn");
    const languageDropdown = document.getElementById("languageDropdown");
    const currentLanguage = document.getElementById("currentLanguage");
    const translatableElements = document.querySelectorAll("[data-en][data-fr]");

    /*
     * Open / Close Language Dropdown
     */
    languageBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        languageSwitcher.classList.toggle("active");
    });

    /*
     * Change Language
     */
    languageDropdown.querySelectorAll("button").forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedLanguage = this.getAttribute("data-language");

            translatableElements.forEach(function (element) {

                if (selectedLanguage === "fr") {
                    element.textContent = element.getAttribute("data-fr");
                } else {
                    element.textContent = element.getAttribute("data-en");
                }

            });
            currentLanguage.textContent =
                selectedLanguage === "fr" ? "FR" : "EN";
            languageSwitcher.classList.remove("active");
            /*
             * Save selected language
             */
            localStorage.setItem("selectedLanguage", selectedLanguage);
        });

    });

    /*
     * Close Dropdown When Clicking Outside
     */
    document.addEventListener("click", function (event) {

        if (!languageSwitcher.contains(event.target)) {
            languageSwitcher.classList.remove("active");
        }
    });

    /*
     * Load Saved Language
     */
    const savedLanguage = localStorage.getItem("selectedLanguage");

    if (savedLanguage === "fr") {

        translatableElements.forEach(function (element) {
            element.textContent = element.getAttribute("data-fr");
        });

        currentLanguage.textContent = "FR";

    } else {

        currentLanguage.textContent = "EN";
    }
});

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       COMMON POPUP FUNCTIONS
    ===================================================== */

    function openPopup(popup) {

        if (!popup) return;

        popup.style.display = "flex";
        popup.style.visibility = "visible";
        popup.style.opacity = "1";
        popup.style.pointerEvents = "auto";

        document.body.style.overflow = "hidden";
    }


    function closePopup(popup) {

        if (!popup) return;

        popup.style.display = "none";
        popup.style.visibility = "hidden";
        popup.style.opacity = "0";
        popup.style.pointerEvents = "none";

        document.body.style.overflow = "";
    }


    /* =====================================================
       POPUP 1
       
       .quotation-btn
       .Project_bt-n a
       
       Opens:
       .get-quotation-popup
    ===================================================== */

    const mainPopup =
        document.querySelector(".get-quotation-popup");


    if (mainPopup) {

        /* ---------------------------------------------
           GET QUOTATION BUTTON
        --------------------------------------------- */

        const quotationBtn =
            document.querySelector(".quotation-btn");

        if (quotationBtn) {

            quotationBtn.addEventListener("click", function (e) {

                e.preventDefault();

                openPopup(mainPopup);

            });

        }


        /* ---------------------------------------------
           START YOUR PROJECT BUTTON
        --------------------------------------------- */

        const projectBtn =
            document.querySelector(".Project_bt-n a");

        if (projectBtn) {

            projectBtn.addEventListener("click", function (e) {

                e.preventDefault();

                openPopup(mainPopup);

            });

        }


        /* ---------------------------------------------
           CLOSE MAIN POPUP
        --------------------------------------------- */

        const mainCloseBtn =
            mainPopup.querySelector(".click_crose");

        if (mainCloseBtn) {

            mainCloseBtn.addEventListener("click", function (e) {

                e.preventDefault();

                closePopup(mainPopup);

            });

        }


        /* ---------------------------------------------
           CLICK OUTSIDE MAIN FORM
        --------------------------------------------- */

        mainPopup.addEventListener("click", function (e) {

            if (e.target === mainPopup) {

                closePopup(mainPopup);

            }

        });

    }


    /* =====================================================
       POPUP 2
       
       .Quote-btnrull
       
       Opens:
       .get-quotation-popup1
    ===================================================== */

    const freeQuotePopup =
        document.querySelector(".get-quotation-popup1");


    if (freeQuotePopup) {

        /* ---------------------------------------------
           REQUEST A FREE QUOTE BUTTON
        --------------------------------------------- */

        const freeQuoteBtn =
            document.querySelector(".Quote-btnrull");

        if (freeQuoteBtn) {

            freeQuoteBtn.addEventListener("click", function (e) {

                e.preventDefault();

                openPopup(freeQuotePopup);

            });

        }


        /* ---------------------------------------------
           CLOSE FREE QUOTE POPUP
        --------------------------------------------- */

        const freeQuoteCloseBtn =
            freeQuotePopup.querySelector(".click_crose");

        if (freeQuoteCloseBtn) {

            freeQuoteCloseBtn.addEventListener("click", function (e) {

                e.preventDefault();

                closePopup(freeQuotePopup);

            });

        }


        /* ---------------------------------------------
           CLICK OUTSIDE FREE QUOTE FORM
        --------------------------------------------- */

        freeQuotePopup.addEventListener("click", function (e) {

            if (e.target === freeQuotePopup) {

                closePopup(freeQuotePopup);

            }

        });

    }


    /* =====================================================
       ESC KEY
       Close whichever popup is currently open
    ===================================================== */

    document.addEventListener("keydown", function (e) {

        if (e.key !== "Escape") return;


        if (mainPopup) {

            const mainStyle =
                window.getComputedStyle(mainPopup);

            if (
                mainStyle.display !== "none" &&
                mainStyle.visibility !== "hidden"
            ) {

                closePopup(mainPopup);

            }

        }


        if (freeQuotePopup) {

            const freeQuoteStyle =
                window.getComputedStyle(freeQuotePopup);

            if (
                freeQuoteStyle.display !== "none" &&
                freeQuoteStyle.visibility !== "hidden"
            ) {

                closePopup(freeQuotePopup);

            }

        }

    });

});

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("mobileMenuToggle");
    const navigation = document.querySelector(".navication-ber");
    const overlay = document.getElementById("mobileMenuOverlay");

    if (!menuToggle || !navigation || !overlay) {
        return;
    }


    /* =====================================================
       OPEN MENU
    ====================================================== */

    function openMobileMenu() {

        navigation.classList.add("active");
        overlay.classList.add("active");
        menuToggle.classList.add("active");

        document.body.classList.add("mobile-menu-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close menu");
    }


    /* =====================================================
       CLOSE MENU
    ====================================================== */

    function closeMobileMenu() {

        navigation.classList.remove("active");
        overlay.classList.remove("active");
        menuToggle.classList.remove("active");

        document.body.classList.remove("mobile-menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
    }
    /* =====================================================
       HAMBURGER
    ====================================================== */
    menuToggle.addEventListener("click", function () {

        if (navigation.classList.contains("active")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }

    });
    /* =====================================================
       OVERLAY CLICK
    ====================================================== */
    overlay.addEventListener("click", function () {
        closeMobileMenu();
    });
    /* =====================================================
       ESC KEY
    ====================================================== */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });
    /* =====================================================
       PRODUCTS SUBMENU
    ====================================================== */
    const submenuArrow = document.querySelector(".submenu-arrow");
    if (submenuArrow) {
        submenuArrow.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            const parentMenu = this.closest(".has-submenu");
            if (!parentMenu) {
                return;
            }
            parentMenu.classList.toggle("active");
        });
    }
    /* =====================================================
       CLOSE SIDEBAR WHEN NORMAL LINK IS CLICKED
    ====================================================== */
    const normalLinks = navigation.querySelectorAll(
        "nav > ul > li:not(.has-submenu) > a"
    );
    normalLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            closeMobileMenu();
        });
    });
    /* =====================================================
       DESKTOP RESET
    ====================================================== */
    window.addEventListener("resize", function () {
        if (window.innerWidth > 992) {
            closeMobileMenu();
            const submenu = document.querySelector(".has-submenu");
            if (submenu) {
                submenu.classList.remove("active");
          }
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const arrows = document.querySelectorAll(".submenu-arrow");
    arrows.forEach(function (arrow) {
        arrow.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            const parent = arrow.closest(".has-submenu");
            if (!parent) return;
            const submenu = parent.querySelector(".submenu1");
            if (!submenu) return;
            /* =========================================
               OPEN / CLOSE SUBMENU
            ========================================= */
            if (submenu.style.display === "block") {
                /* Close submenu */
                submenu.style.display = "none";
                /* Chevron Up → Chevron Down */
                arrow.classList.remove("fa-chevron-up");
                arrow.classList.add("fa-chevron-down");
            } else {
                /* Open submenu */
                submenu.style.display = "block";
                /* Chevron Down → Chevron Up */
                arrow.classList.remove("fa-chevron-down");
                arrow.classList.add("fa-chevron-up");
            }
        });
    });
});




