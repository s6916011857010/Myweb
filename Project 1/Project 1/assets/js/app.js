/**
 * Web Application รายงานผลงานบุคคล (Personal Portfolio & Academic Report)
 * - Splash screen with background decoration on first load & refresh
 * - Loading spin on all user interactions
 * - Interactive Chart.js inside <div><canvas></div>
 * - Table overflow filtering
 * - Toast notification system
 * - Theme colors: #3BB489, #76C58C, #26A69A, #AED581, #FFCA28, #FF8A65, #EF5350, #4A2C6D, #D32F2F, #F57C00, #FBC02D, #0288D1
 */

// Global Chart Instance
let wekaChartInstance = null;
let priceTrendChartInstance = null;

// WEKA Machine Learning Experimental Data from Research Paper
const wekaModelsData = [
  {
    id: 1,
    name: "Random Forest",
    thName: "ป่าสุ่ม (Random Forest)",
    category: "Tree-based",
    wekaClass: "weka.classifiers.trees.RandomForest",
    accuracy: 94.2,
    mae: 0.118,
    rmse: 0.176,
    rae: 21.4,
    buildTime: "0.42 วินาที",
    performanceRank: "ยอดเยี่ยม (Best Model)",
    rankBadgeClass: "badge-mint",
    description: "มีประสิทธิภาพสูงสุดในการพยากรณ์ราคา ลดปัญหา Overfitting ด้วย Ensemble Learning และ 100 Trees"
  },
  {
    id: 2,
    name: "SMO / SVM",
    thName: "เครื่องเวกเตอร์ค้ำจุน (SMO - Support Vector Machine)",
    category: "Kernel/Neural",
    wekaClass: "weka.classifiers.functions.SMOreg",
    accuracy: 91.5,
    mae: 0.145,
    rmse: 0.218,
    rae: 26.8,
    buildTime: "0.85 วินาที",
    performanceRank: "ดีเยี่ยม (High Precision)",
    rankBadgeClass: "badge-teal",
    description: "ใช้ RBF Kernel ในการหา Hyperplane ที่เหมาะสมกับมิติข้อมูลที่ซับซ้อน ให้ค่าคลาดเคลื่อนต่ำ"
  },
  {
    id: 3,
    name: "Multilayer Perceptron",
    thName: "โครงข่ายประสาทเทียม (Multilayer Perceptron)",
    category: "Kernel/Neural",
    wekaClass: "weka.classifiers.functions.MultilayerPerceptron",
    accuracy: 89.8,
    mae: 0.162,
    rmse: 0.239,
    rae: 30.5,
    buildTime: "2.14 วินาที",
    performanceRank: "ดีมาก (Neural Net)",
    rankBadgeClass: "badge-purple",
    description: "สถาปัตยกรรม 2 Hidden Layers พร้อมการเรียนรู้แบบ Backpropagation มีความแม่นยำสูงแต่ใช้เวลาประมวลผลสูง"
  },
  {
    id: 4,
    name: "J48 / REPTree",
    thName: "ต้นไม้ตัดสินใจ (J48 / REPTree)",
    category: "Tree-based",
    wekaClass: "weka.classifiers.trees.REPTree",
    accuracy: 87.4,
    mae: 0.188,
    rmse: 0.275,
    rae: 35.2,
    buildTime: "0.18 วินาที",
    performanceRank: "ดี (Fast & Interpretable)",
    rankBadgeClass: "badge-lime",
    description: "สร้างกฎการตัดสินใจที่เข้าใจและอธิบายได้ง่าย (Explainable AI) ทำงานได้รวดเร็วที่สุด"
  },
  {
    id: 5,
    name: "Linear Regression",
    thName: "การถดถอยเชิงเส้น (Linear Regression)",
    category: "Statistical",
    wekaClass: "weka.classifiers.functions.LinearRegression",
    accuracy: 84.1,
    mae: 0.212,
    rmse: 0.312,
    rae: 40.1,
    buildTime: "0.08 วินาที",
    performanceRank: "มาตรฐานอ้างอิง (Baseline)",
    rankBadgeClass: "badge-amber",
    description: "ใช้เป็นโมเดลพื้นฐานในการเปรียบเทียบ (Baseline Benchmark) เพื่อแสดงความเหนือกว่าของอัลกอริทึม ML"
  }
];

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  initSplashScreen();
  renderWekaTable(wekaModelsData);
  initCharts();
  initContactForm();
  initActiveNavHighlight();
  initMusicPlayer();
});

/* =============================================================
   1. SPLASH SCREEN & BACKGROUND DECORATION CONTROLLER
   ============================================================= */
function initSplashScreen() {
  const splashScreen = document.getElementById("splash-screen");
  const splashProgress = document.getElementById("splash-progress");
  const splashPercent = document.getElementById("splash-percent");
  const splashStatus = document.getElementById("splash-status");

  if (!splashScreen) return;

  // Reset states
  splashScreen.classList.remove("fade-out");
  splashScreen.style.display = "flex";
  splashScreen.style.opacity = "1";
  splashScreen.style.visibility = "visible";

  let progress = 0;
  const statusTexts = [
    { p: 15, text: "กำลังเริ่มต้นระบบพอร์ตโฟลิโอส่วนบุคคล..." },
    { p: 40, text: "กำลังโหลดข้อมูลประวัติการศึกษาและสถาบัน..." },
    { p: 70, text: "กำลังประมวลผลข้อมูลบทความวิจัย WEKA Machine Learning..." },
    { p: 90, text: "จัดเตรียมแผนที่และระบบการติดต่อ..." },
    { p: 100, text: "ระบบพร้อมแสดงผล ยินดีต้อนรับ" }
  ];

  const interval = setInterval(() => {
    // Increment progress smoothly
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress > 100) progress = 100;

    if (splashProgress) splashProgress.style.width = `${progress}%`;
    if (splashPercent) splashPercent.textContent = `${progress}%`;

    // Update status text
    const currentStatus = statusTexts.find(s => progress <= s.p) || statusTexts[statusTexts.length - 1];
    if (splashStatus && currentStatus) {
      splashStatus.textContent = currentStatus.text;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        hideSplashScreen();
      }, 500);
    }
  }, 60);

  // Allow clicking skip button
  const skipBtn = document.getElementById("btn-skip-splash");
  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      clearInterval(interval);
      hideSplashScreen();
    });
  }
}

function hideSplashScreen() {
  const splashScreen = document.getElementById("splash-screen");
  if (!splashScreen) return;
  splashScreen.classList.add("fade-out");
  setTimeout(() => {
    splashScreen.style.display = "none";
  }, 750);
}

// Function to replay splash screen (for testing or user demo)
window.replaySplashScreen = function() {
  showGlobalLoading("กำลังเตรียมแสดง Splash Screen อีกครั้ง...", 300, () => {
    initSplashScreen();
    showToast("เริ่มแสดง Splash Screen จำลองการรีเฟรชหน้าจอ", "info");
  });
};

/* =============================================================
   2. GLOBAL LOADING SPIN SYSTEM (สำหรับทุกกระบวนการทำงาน)
   ============================================================= */
function showGlobalLoading(message = "กำลังประมวลผลข้อมูล...", duration = 400, callback = null) {
  const loader = document.getElementById("global-action-loader");
  const loaderText = document.getElementById("global-loader-text");

  if (loaderText) loaderText.textContent = message;
  if (loader) {
    loader.classList.add("active");
  }

  setTimeout(() => {
    if (loader) {
      loader.classList.remove("active");
    }
    if (typeof callback === "function") {
      callback();
    }
  }, duration);
}

// Loading wrapper for buttons
window.triggerActionWithLoading = function(buttonElement, actionName, callback, duration = 500) {
  const originalHtml = buttonElement.innerHTML;
  buttonElement.disabled = true;
  buttonElement.innerHTML = `<span class="loading-spinner-sm mr-2"></span> กำลัง${actionName}...`;

  setTimeout(() => {
    buttonElement.disabled = false;
    buttonElement.innerHTML = originalHtml;
    if (typeof callback === "function") {
      callback();
    }
  }, duration);
};

/* =============================================================
   3. TAB & NAVIGATION INTERACTION WITH LOADING SPIN
   ============================================================= */
window.switchSection = function(sectionId, element) {
  // Trigger loading spinner for smooth UX
  showGlobalLoading(`กำลังเปลี่ยนไปยังส่วน "${getSectionTitle(sectionId)}" ...`, 350, () => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Update active state in desktop and mobile nav
    document.querySelectorAll(".nav-link-item").forEach(link => {
      link.classList.remove("text-pastel-main", "font-bold", "bg-emerald-50");
    });
    if (element) {
      element.classList.add("text-pastel-main", "font-bold");
    }
  });
};

function getSectionTitle(id) {
  switch (id) {
    case "education": return "ประวัติการศึกษา";
    case "research": return "ผลงานบทความวิจัย";
    case "contact": return "สถานที่ติดต่อ";
    default: return "หน้าหลัก";
  }
}

function initActiveNavHighlight() {
  const sections = ["hero", "education", "research", "contact"];
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + 200;
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          document.querySelectorAll(`[data-nav-target="${id}"]`).forEach(btn => {
            btn.classList.add("active-nav");
          });
        } else {
          document.querySelectorAll(`[data-nav-target="${id}"]`).forEach(btn => {
            btn.classList.remove("active-nav");
          });
        }
      }
    });
  });
}

/* =============================================================
   4. CHART.JS INITIALIZATION (<div> <canvas> </canvas> </div>)
   ============================================================= */
function initCharts() {
  const ctx = document.getElementById("wekaChart");
  if (!ctx) return;

  // Render Default Accuracy Bar Chart
  renderAccuracyChart();
}

function renderAccuracyChart() {
  const ctx = document.getElementById("wekaChart").getContext("2d");
  if (wekaChartInstance) wekaChartInstance.destroy();

  const labels = wekaModelsData.map(m => m.name);
  const dataAccuracy = wekaModelsData.map(m => m.accuracy);

  wekaChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "ค่าความแม่นยำ / Correlation (%)",
          data: dataAccuracy,
          backgroundColor: [
            "rgba(59, 180, 137, 0.85)",  // #3BB489 (Random Forest - Best)
            "rgba(38, 166, 154, 0.85)",  // #26A69A (SMO / SVM)
            "rgba(74, 44, 109, 0.85)",   // #4A2C6D (Multilayer Perceptron)
            "rgba(174, 213, 129, 0.85)", // #AED581 (J48 Decision Tree)
            "rgba(255, 202, 40, 0.85)"   // #FFCA28 (Linear Regression)
          ],
          borderColor: [
            "#3BB489",
            "#26A69A",
            "#4A2C6D",
            "#AED581",
            "#FFCA28"
          ],
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 38
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: { family: "Sarabun", size: 13 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ความถูกต้อง: ${context.parsed.y}% (WEKA 10-Fold CV)`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 75,
          max: 100,
          title: {
            display: true,
            text: "ความแม่นยำ (%)",
            font: { family: "Sarabun", size: 12 }
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)"
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function renderErrorChart() {
  const ctx = document.getElementById("wekaChart").getContext("2d");
  if (wekaChartInstance) wekaChartInstance.destroy();

  const labels = wekaModelsData.map(m => m.name);
  const dataMAE = wekaModelsData.map(m => m.mae);
  const dataRMSE = wekaModelsData.map(m => m.rmse);

  wekaChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "MAE (Mean Absolute Error - ยิ่งต่ำยิ่งดี)",
          data: dataMAE,
          backgroundColor: "rgba(59, 180, 137, 0.8)", // #3BB489
          borderColor: "#3BB489",
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: "RMSE (Root Mean Squared Error - ยิ่งต่ำยิ่งดี)",
          data: dataRMSE,
          backgroundColor: "rgba(255, 138, 101, 0.8)", // #FF8A65
          borderColor: "#FF8A65",
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: { font: { family: "Sarabun", size: 13 } }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ` ${ctx.dataset.label}: ${ctx.parsed.y}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "ค่าความคลาดเคลื่อนในการพยากรณ์",
            font: { family: "Sarabun", size: 12 }
          },
          grid: { color: "rgba(0, 0, 0, 0.05)" }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

function renderRadarChart() {
  const ctx = document.getElementById("wekaChart").getContext("2d");
  if (wekaChartInstance) wekaChartInstance.destroy();

  wekaChartInstance = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["ความแม่นยำ (Accuracy)", "ความเร็ว (Speed)", "ความทนทาน Overfitting", "ความสามารถในการอธิบาย", "ความเสถียร (Stability)"],
      datasets: [
        {
          label: "Random Forest (WEKA)",
          data: [94, 88, 95, 82, 96],
          backgroundColor: "rgba(59, 180, 137, 0.3)",
          borderColor: "#3BB489",
          pointBackgroundColor: "#3BB489",
          pointBorderColor: "#fff",
          borderWidth: 2
        },
        {
          label: "SMO / SVM (WEKA)",
          data: [91, 75, 90, 70, 92],
          backgroundColor: "rgba(38, 166, 154, 0.25)",
          borderColor: "#26A69A",
          pointBackgroundColor: "#26A69A",
          pointBorderColor: "#fff",
          borderWidth: 2
        },
        {
          label: "Multilayer Perceptron (WEKA)",
          data: [90, 60, 85, 65, 88],
          backgroundColor: "rgba(74, 44, 109, 0.25)",
          borderColor: "#4A2C6D",
          pointBackgroundColor: "#4A2C6D",
          pointBorderColor: "#fff",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { font: { family: "Sarabun", size: 12 } }
        }
      },
      scales: {
        r: {
          min: 50,
          max: 100,
          ticks: { stepSize: 10 },
          grid: { color: "rgba(0, 0, 0, 0.06)" }
        }
      }
    }
  });
}

// Chart Switching with Loading Spin
window.switchChartMode = function(mode, buttonElement) {
  // Update button active state
  document.querySelectorAll(".chart-toggle-btn").forEach(btn => {
    btn.classList.remove("active", "bg-pastel-main", "text-white");
    btn.classList.add("bg-white", "text-gray-700");
  });
  if (buttonElement) {
    buttonElement.classList.add("active", "bg-pastel-main", "text-white");
    buttonElement.classList.remove("bg-white", "text-gray-700");
  }

  // Show loading spinner during chart transformation
  showGlobalLoading(`กำลังโหลดกราฟ ${getChartModeName(mode)} ด้วยโปรแกรม WEKA...`, 300, () => {
    if (mode === "accuracy") {
      renderAccuracyChart();
    } else if (mode === "error") {
      renderErrorChart();
    } else if (mode === "radar") {
      renderRadarChart();
    }
    showToast(`สลับการแสดงผลกราฟ: ${getChartModeName(mode)} สำเร็จ`, "success");
  });
};

function getChartModeName(mode) {
  if (mode === "accuracy") return "ค่าความแม่นยำ (%)";
  if (mode === "error") return "ค่าความคลาดเคลื่อน (MAE/RMSE)";
  if (mode === "radar") return "เรดาร์มิติรวม (Radar Chart)";
  return mode;
}

/* =============================================================
   5. TABLE OVERFLOW RENDERING & FILTERING
   ============================================================= */
function renderWekaTable(data) {
  const tbody = document.getElementById("weka-table-body");
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-8 text-gray-500">
          <i class="fas fa-search-minus text-2xl mb-2 text-gray-400 block"></i>
          ไม่พบข้อมูลอัลกอริทึมที่ตรงกับเงื่อนไขการค้นหา
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = data.map((item, index) => `
    <tr class="hover:bg-emerald-50/40 transition-colors">
      <td class="font-semibold text-gray-800">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
            ${index + 1}
          </span>
          <div>
            <div class="font-bold text-gray-900">${item.name}</div>
            <div class="text-xs text-gray-500">${item.thName}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${item.rankBadgeClass}">
          ${item.performanceRank}
        </span>
      </td>
      <td>
        <span class="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-mono">
          ${item.category}
        </span>
      </td>
      <td class="font-semibold text-emerald-600">
        ${item.accuracy}%
      </td>
      <td class="font-mono text-gray-700">
        ${item.mae}
      </td>
      <td class="font-mono text-gray-700">
        ${item.rmse}
      </td>
      <td class="text-xs text-gray-500">
        ${item.buildTime}
      </td>
    </tr>
  `).join("");
}

// Table Filter Function
window.filterWekaTable = function(category, buttonElement) {
  // Update button active UI
  document.querySelectorAll(".table-filter-btn").forEach(btn => {
    btn.classList.remove("active", "bg-emerald-600", "text-white");
    btn.classList.add("bg-white", "text-gray-600");
  });
  if (buttonElement) {
    buttonElement.classList.add("active", "bg-emerald-600", "text-white");
    buttonElement.classList.remove("bg-white", "text-gray-600");
  }

  // Loading spin simulation
  showGlobalLoading("กำลังกรองข้อมูลอัลกอริทึมใน WEKA...", 250, () => {
    let filtered = wekaModelsData;
    if (category !== "all") {
      filtered = wekaModelsData.filter(m => m.category === category);
    }
    renderWekaTable(filtered);
    showToast(`กรองผลการวิจัยกลุ่ม: ${category === "all" ? "ทั้งหมด" : category}`, "info");
  });
};

// Search Table
window.searchWekaTable = function(event) {
  const query = event.target.value.toLowerCase().trim();
  const filtered = wekaModelsData.filter(m => 
    m.name.toLowerCase().includes(query) ||
    m.thName.toLowerCase().includes(query) ||
    m.category.toLowerCase().includes(query) ||
    m.wekaClass.toLowerCase().includes(query)
  );
  renderWekaTable(filtered);
};

/* =============================================================
   6. RESEARCH DETAIL MODAL & CITATION CONTROLLER
   ============================================================= */
window.openResearchModal = function(btn) {
  triggerActionWithLoading(btn, "เปิดเอกสารวิจัย", () => {
    const modal = document.getElementById("research-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    }
  }, 350);
};

window.closeResearchModal = function() {
  const modal = document.getElementById("research-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "auto";
  }
};

window.copyCitation = function(btn) {
  const citationText = `รายงานผลงานทางวิชาการ. (2568). การพยากรณ์ราคาด้วยการเรียนรู้ของเครื่องจักรด้วยโปรแกรมเวก้า (Price Forecasting using Machine Learning with WEKA). วารสารมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ.`;

  triggerActionWithLoading(btn, "คัดลอกรายการอ้างอิง", () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(citationText).then(() => {
        showToast("คัดลอกข้อมูลรายการอ้างอิง (Citation) เรียบร้อยแล้ว", "success");
      });
    } else {
      showToast("คัดลอกข้อมูลรายการอ้างอิงเรียบร้อยแล้ว", "success");
    }
  }, 400);
};

window.downloadResearchSummary = function(btn) {
  triggerActionWithLoading(btn, "สร้างรายงานสรุป PDF", () => {
    showToast("ระบบกำลังจัดเตรียมและพิมพ์เอกสารสรุปผลงานวิจัย...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
  }, 600);
};

/* =============================================================
   7. CONTACT FORM & LOCATION ACTIONS
   ============================================================= */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Check validation
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) {
      showToast("กรุณากรอกข้อมูลให้ครบถ้วนก่อนส่งข้อความ", "warning");
      return;
    }

    // Trigger loading spinner
    triggerActionWithLoading(submitBtn, "ส่งข้อความ", () => {
      form.reset();
      showToast("ส่งข้อความเรียบร้อยแล้ว ขอบคุณสำหรับการติดต่อ!", "success");
    }, 800);
  });
}

window.copyAddress = function(btn) {
  const address = "ประชาราษฎร์สาย 1 บางซื่อ กทม 10800";
  triggerActionWithLoading(btn, "คัดลอกที่อยู่", () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address).then(() => {
        showToast("คัดลอกที่อยู่: " + address + " ไปยังคลิปบอร์ดแล้ว", "success");
      });
    } else {
      showToast("คัดลอกที่อยู่เรียบร้อยแล้ว", "success");
    }
  }, 350);
};

window.openGoogleMap = function() {
  const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("ประชาราษฎร์สาย 1 บางซื่อ กทม 10800");
  window.open(url, "_blank");
};

/* =============================================================
   8. TOAST NOTIFICATION UTILITY
   ============================================================= */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";

  let iconHtml = '<i class="fas fa-info-circle text-sky-500 text-lg"></i>';
  if (type === "success") {
    iconHtml = '<i class="fas fa-check-circle text-emerald-500 text-lg"></i>';
  } else if (type === "warning") {
    iconHtml = '<i class="fas fa-exclamation-triangle text-amber-500 text-lg"></i>';
  } else if (type === "error") {
    iconHtml = '<i class="fas fa-times-circle text-rose-500 text-lg"></i>';
  }

  toast.innerHTML = `
    <div class="flex-shrink-0">${iconHtml}</div>
    <div class="flex-1 text-sm text-gray-800 font-medium">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 text-xs ml-2">
      <i class="fas fa-times"></i>
    </button>
  `;

  container.appendChild(toast);

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    toast.classList.add("toast-hiding");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}

/* =============================================================
   9. BACKGROUND MUSIC PLAYER (เล่นเพลงช่วง 20 วิเป็นต้นไป)
   ============================================================= */
const BGM_START_TIME = 20; // เริ่มต้นที่ 20 วินาทีตามที่ผู้ใช้กำหนด

let bgmAudio = null;
let isBgmPlaying = false;

function initMusicPlayer() {
  bgmAudio = document.getElementById("bgm-audio");
  if (!bgmAudio) return;

  // Initial setup: ensure start time is at least 20s
  bgmAudio.addEventListener("loadedmetadata", () => {
    if (bgmAudio.currentTime < BGM_START_TIME) {
      bgmAudio.currentTime = BGM_START_TIME;
    }
    updateTimeDisplay();
  });

  // When playing, enforce starting at >= 20 seconds
  bgmAudio.addEventListener("play", () => {
    if (bgmAudio.currentTime < BGM_START_TIME) {
      bgmAudio.currentTime = BGM_START_TIME;
    }
    setMusicPlayingState(true);
  });

  bgmAudio.addEventListener("pause", () => {
    setMusicPlayingState(false);
  });

  // When song ends, loop back to 20 seconds
  bgmAudio.addEventListener("ended", () => {
    bgmAudio.currentTime = BGM_START_TIME;
    bgmAudio.play().catch(e => console.log(e));
  });

  // Update time and seek bar
  bgmAudio.addEventListener("timeupdate", () => {
    updateTimeDisplay();
  });

  // Seek bar listener (minimum 20s)
  const seekSlider = document.getElementById("music-seek-slider");
  if (seekSlider) {
    seekSlider.addEventListener("input", (e) => {
      const seekTo = parseFloat(e.target.value);
      bgmAudio.currentTime = Math.max(BGM_START_TIME, seekTo);
    });
  }

  // Volume slider listener
  const volumeSlider = document.getElementById("music-volume-slider");
  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      bgmAudio.volume = parseFloat(e.target.value);
      const icon = document.getElementById("music-vol-icon");
      if (icon) {
        if (bgmAudio.volume === 0) icon.className = "fas fa-volume-mute text-xs text-gray-400";
        else if (bgmAudio.volume < 0.5) icon.className = "fas fa-volume-down text-xs text-emerald-600";
        else icon.className = "fas fa-volume-up text-xs text-emerald-600";
      }
    });
  }

  // File input fallback in case user wants to pick any audio file
  const fileInput = document.getElementById("music-file-input");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        bgmAudio.src = fileUrl;
        bgmAudio.currentTime = BGM_START_TIME;
        bgmAudio.play().then(() => {
          setMusicPlayingState(true);
          showToast(`โหลดไฟล์เพลง "${file.name}" เริ่มเล่นที่ 20 วิ 🎵`, "success");
        });
      }
    });
  }
}

function updateTimeDisplay() {
  if (!bgmAudio) return;
  const currentSpan = document.getElementById("music-current-time");
  const durationSpan = document.getElementById("music-duration-time");
  const seekSlider = document.getElementById("music-seek-slider");

  const current = bgmAudio.currentTime || 0;
  const duration = bgmAudio.duration || 0;

  if (currentSpan) currentSpan.textContent = formatTime(current);
  if (durationSpan && !isNaN(duration) && duration > 0) durationSpan.textContent = formatTime(duration);

  if (seekSlider && !isNaN(duration) && duration > 0) {
    seekSlider.min = BGM_START_TIME;
    seekSlider.max = duration;
    seekSlider.value = Math.max(BGM_START_TIME, current);
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

window.togglePlayBgm = function() {
  if (!bgmAudio) return;

  if (bgmAudio.paused) {
    if (bgmAudio.currentTime < BGM_START_TIME) {
      bgmAudio.currentTime = BGM_START_TIME;
    }
    bgmAudio.play().then(() => {
      setMusicPlayingState(true);
      showToast("เริ่มเล่นเพลงประกอบ (ช่วง 20 วินาทีเป็นต้นไป) 🎵", "success");
    }).catch(err => {
      console.warn("Audio playback require user interaction:", err);
      showToast("แตะที่ปุ่มเพื่ออนุญาตให้เล่นเสียงเพลง", "info");
    });
  } else {
    bgmAudio.pause();
    setMusicPlayingState(false);
    showToast("หยุดพักเพลงประกอบชั่วคราว", "info");
  }
};

window.restartFrom20s = function() {
  if (!bgmAudio) return;
  bgmAudio.currentTime = BGM_START_TIME;
  bgmAudio.play().then(() => {
    setMusicPlayingState(true);
    showToast("เริ่มเล่นเพลงใหม่ตั้งแต่ช่วง 20 วินาที 🎵", "info");
  });
};

function setMusicPlayingState(isPlaying) {
  isBgmPlaying = isPlaying;

  // Toggle icons
  document.querySelectorAll(".music-play-icon").forEach(icon => {
    if (isPlaying) {
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
    } else {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }
  });

  // Animate vinyl disc
  const vinyl = document.getElementById("music-vinyl");
  if (vinyl) {
    if (isPlaying) vinyl.classList.add("playing");
    else vinyl.classList.remove("playing");
  }

  // Animate soundwaves
  const wave = document.getElementById("music-soundwave");
  if (wave) {
    if (isPlaying) wave.classList.add("playing");
    else wave.classList.remove("playing");
  }

  // Header quick indicator badge
  const headerBtn = document.getElementById("header-music-btn");
  if (headerBtn) {
    if (isPlaying) {
      headerBtn.classList.add("bg-emerald-100", "text-emerald-800", "border-emerald-400");
    } else {
      headerBtn.classList.remove("bg-emerald-100", "text-emerald-800", "border-emerald-400");
    }
  }
}

window.toggleMusicWidgetMinimize = function() {
  const panel = document.getElementById("music-player-panel");
  const miniBtn = document.getElementById("music-mini-toggle");
  if (panel && miniBtn) {
    if (panel.classList.contains("minimized")) {
      panel.classList.remove("minimized");
      miniBtn.classList.add("hidden");
    } else {
      panel.classList.add("minimized");
      miniBtn.classList.remove("hidden");
    }
  }
};

