const phaseTabs = [...document.querySelectorAll(".phase-tab")];
const phaseViews = [...document.querySelectorAll(".phase-view")];
const form = document.querySelector("#questionnaireForm");
const progressBar = document.querySelector("#progressBar");
const completionLabel = document.querySelector("#completionLabel");
const coreQuestionsEl = document.querySelector("#coreQuestions");
const followUpArea = document.querySelector("#followUpArea");
const tagCloud = document.querySelector("#tagCloud");
const rankingList = document.querySelector("#rankingList");
const skuCards = document.querySelector("#skuCards");
const leaderSummary = document.querySelector("#leaderSummary");

let currentPhase = 1;

const coreQuestions = [
  {
    id: "stress",
    title: "1. 壓力情況如何？",
    options: [
      ["low", "一點點"],
      ["medium", "很多"],
      ["high", "非常多"],
    ],
    tags: {
      low: ["壓力"],
      medium: ["壓力", "睡眠", "消化"],
      high: ["壓力", "睡眠", "消化", "食慾"],
    },
  },
  {
    id: "sleep",
    title: "2. 睡得好嗎？",
    options: [
      ["regular", "規律，睡醒精神好"],
      ["irregular", "不規律"],
      ["insomnia", "失眠"],
      ["wake", "睡眠中反覆醒來"],
      ["tired", "睡不飽"],
    ],
    tags: {
      regular: ["睡眠"],
      irregular: ["睡眠", "荷爾蒙"],
      insomnia: ["睡眠", "壓力", "營養不足"],
      wake: ["睡眠", "循環"],
      tired: ["睡眠", "疲勞"],
    },
  },
  {
    id: "digestion",
    title: "3. 消化好嗎？",
    options: [
      ["good", "消化不錯"],
      ["mixed", "時好時壞"],
      ["bloat", "肚子脹氣"],
      ["unknown", "不太清楚"],
    ],
    tags: {
      good: ["消化"],
      mixed: ["消化", "營養吸收"],
      bloat: ["消化", "腸胃", "營養吸收"],
      unknown: ["消化"],
    },
  },
  {
    id: "cold",
    title: "4. 平時會手腳冰冷嗎？",
    options: [
      ["mild", "有點冷"],
      ["strong", "很冷"],
      ["normal", "普通/還好"],
      ["unknown", "沒想過"],
    ],
    tags: {
      mild: ["循環", "體寒"],
      strong: ["循環", "體寒", "荷爾蒙"],
      normal: ["循環"],
      unknown: ["循環"],
    },
  },
  {
    id: "edema",
    title: "5. 會經常水腫嗎？",
    options: [
      ["morning", "早上水腫"],
      ["afternoon", "下午水腫"],
      ["none", "不會水腫"],
      ["unknown", "不太清楚"],
      ["snack", "經常吃宵夜"],
      ["lowActivity", "活動量低"],
    ],
    tags: {
      morning: ["水腫", "水分代謝"],
      afternoon: ["水腫", "循環"],
      none: ["水腫"],
      unknown: ["水腫"],
      snack: ["水腫", "飲食", "壓力"],
      lowActivity: ["水腫", "循環", "活動量"],
    },
  },
  {
    id: "bowel",
    title: "6. 每天排便次數是？",
    options: [
      ["daily", "一天一次"],
      ["twice", "一天 2-3 次"],
      ["slow", "2-3 天一次"],
      ["weekly", "一週一次"],
      ["other", "其他"],
    ],
    tags: {
      daily: ["腸道"],
      twice: ["腸道"],
      slow: ["腸道", "排便", "營養吸收"],
      weekly: ["腸道", "排便", "毒素累積"],
      other: ["腸道"],
    },
  },
];

const concernTags = {
  weight: ["減重", "飲食", "活動量"],
  energy: ["疲勞", "睡眠", "營養不足"],
  sleep: ["睡眠", "壓力"],
  digestion: ["消化", "腸胃"],
  edema: ["水腫", "循環"],
  cycle: ["荷爾蒙", "體寒"],
  bowel: ["腸道", "排便"],
};

const occupationTags = {
  sedentary: ["活動量", "循環"],
  standing: ["循環", "水腫"],
  shift: ["睡眠", "飲食"],
  pressure: ["壓力", "食慾"],
  care: ["疲勞", "壓力"],
  other: [],
};

const followUps = [
  {
    id: "meal",
    title: "飲食習慣",
    trigger: ["減重", "飲食", "消化", "腸胃", "水腫"],
    questions: ["是否吃零食？", "是否規律用餐？", "主要食物種類/食譜？", "用餐速度如何？"],
  },
  {
    id: "water",
    title: "水分攝取",
    trigger: ["水腫", "循環", "排便", "疲勞"],
    questions: ["每日水分攝取量？", "是否習慣少量多次喝水？", "是否常覺得口渴或不口渴？"],
  },
  {
    id: "activity",
    title: "活動與工作環境",
    trigger: ["活動量", "循環", "水腫", "體寒"],
    questions: ["工作是久坐或久站？", "每週活動量如何？", "是否輪班或常熬夜？"],
  },
  {
    id: "weight",
    title: "體態與減重經驗",
    trigger: ["減重", "飲食", "毒素累積"],
    questions: ["是否有脂肪團？", "有無減肥經驗？", "期望減重值？", "期望改善部位？"],
  },
  {
    id: "cycle",
    title: "女性週期/荷爾蒙",
    trigger: ["荷爾蒙", "體寒", "睡眠", "壓力"],
    questions: ["生理週期是否規律？", "經血量是否改變？", "經期是否不適？"],
  },
  {
    id: "supplement",
    title: "補充品與藥物",
    trigger: ["營養吸收", "消化", "腸道", "疲勞"],
    questions: ["是否正在服用藥物？", "是否正在使用保健品？", "使用後感受如何？"],
  },
];

const skuMap = [
  {
    name: "Sample A: Digest & Gut Support",
    tags: ["消化", "腸道", "排便", "營養吸收"],
    reason: "適合腸胃吸收、排便與消化相關關注的初步樣品。",
  },
  {
    name: "Sample B: Circulation & Water Balance",
    tags: ["循環", "水腫", "水分代謝", "體寒"],
    reason: "適合水腫、手腳冰冷、久坐久站族群的初步樣品。",
  },
  {
    name: "Sample C: Stress & Sleep Balance",
    tags: ["壓力", "睡眠", "疲勞", "荷爾蒙"],
    reason: "適合壓力、睡眠品質與疲勞相關關注的初步樣品。",
  },
  {
    name: "Sample D: Weight Management Starter",
    tags: ["減重", "飲食", "活動量", "食慾"],
    reason: "適合減重、體脂、飲食習慣與活動量相關的初步樣品。",
  },
];

function renderCoreQuestions() {
  coreQuestionsEl.innerHTML = coreQuestions
    .map((question) => {
      const options = question.options
        .map(
          ([value, label]) => `
            <label class="option-row">
              <input type="radio" name="${question.id}" value="${value}" required />
              <span>${label}</span>
            </label>
          `
        )
        .join("");

      return `
        <article class="question-card">
          <h3>${question.title}</h3>
          <div class="options">${options}</div>
        </article>
      `;
    })
    .join("");
}

function getFormValues() {
  return Object.fromEntries(new FormData(form).entries());
}

function collectTags() {
  const values = getFormValues();
  const tags = [];

  tags.push(...(concernTags[values.primaryConcern] || []));
  tags.push(...(occupationTags[values.occupation] || []));

  coreQuestions.forEach((question) => {
    const answer = values[question.id];
    if (answer) tags.push(...(question.tags[answer] || []));
  });

  return tags;
}

function rankTags() {
  const score = new Map();
  collectTags().forEach((tag) => score.set(tag, (score.get(tag) || 0) + 1));
  return [...score.entries()].sort((a, b) => b[1] - a[1]);
}

function updateInsights() {
  const ranked = rankTags();
  const topTags = ranked.slice(0, 8).map(([tag]) => tag);

  tagCloud.innerHTML = topTags.length
    ? topTags.map((tag) => `<span>${tag}</span>`).join("")
    : "<span>等待填寫</span>";

  rankingList.innerHTML = ranked.length
    ? ranked
        .slice(0, 6)
        .map(([tag, count]) => `<li>${tag} <strong>${count}</strong></li>`)
        .join("")
    : "<li>尚未產生</li>";
}

function selectFollowUps() {
  const topTags = rankTags().slice(0, 10).map(([tag]) => tag);
  return followUps
    .map((item) => ({
      ...item,
      score: item.trigger.filter((tag) => topTags.includes(tag)).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function renderFollowUps() {
  const selected = selectFollowUps();
  followUpArea.innerHTML = selected.length
    ? selected
        .map(
          (group) => `
            <article class="question-card">
              <h3>${group.title}</h3>
              <div class="options">
                ${group.questions
                  .map(
                    (question, index) => `
                      <label class="option-row">
                        <input type="checkbox" name="${group.id}_${index}" />
                        <span>${question}</span>
                      </label>
                    `
                  )
                  .join("")}
              </div>
            </article>
          `
        )
        .join("")
    : `<p class="notice">請先完成 Phase 1 和 Phase 2，系統才會產生相關追問。</p>`;
}

function renderRecommendations() {
  const topTags = rankTags().map(([tag]) => tag);
  const rankedSkus = skuMap
    .map((sku) => ({
      ...sku,
      score: sku.tags.filter((tag) => topTags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  skuCards.innerHTML = rankedSkus
    .map(
      (sku) => `
        <article class="sku-card">
          <strong>${sku.name}</strong>
          <p>${sku.reason}</p>
        </article>
      `
    )
    .join("");

  const topSix = rankTags().slice(0, 6).map(([tag]) => tag).join("、");
  leaderSummary.textContent = topSix
    ? `目前主要關注排序為：${topSix}。Demo 推薦先用樣品卡展示，待產品資料庫欄位確認後，再由 AI 依標籤、限制條件與團隊長調整規則產出正式 SKU。`
    : "完成問卷後，這裡會整理答案摘要、推薦理由與可人工調整的方向。";
}

function validatePhase(phase) {
  const activeView = document.querySelector(`[data-view="${phase}"]`);
  const required = [...activeView.querySelectorAll("[required]")];
  const invalid = required.find((field) => {
    if (field.type === "radio") {
      return !activeView.querySelector(`input[name="${field.name}"]:checked`);
    }
    return !field.value;
  });

  if (invalid) {
    invalid.focus();
    return false;
  }
  return true;
}

function setPhase(phase) {
  currentPhase = phase;
  phaseViews.forEach((view) => view.classList.toggle("active", Number(view.dataset.view) === phase));
  phaseTabs.forEach((tab) => {
    const tabPhase = Number(tab.dataset.phase);
    tab.classList.toggle("active", tabPhase === phase);
    if (tabPhase <= phase) tab.disabled = false;
  });
  progressBar.style.width = `${phase * 33.34}%`;
  completionLabel.textContent = `Phase ${phase} of 3`;

  if (phase === 3) {
    renderFollowUps();
    renderRecommendations();
  }
  updateInsights();
}

document.addEventListener("click", (event) => {
  const next = event.target.closest("[data-next]");
  const prev = event.target.closest("[data-prev]");
  const tab = event.target.closest(".phase-tab");

  if (next) {
    const target = Number(next.dataset.next);
    if (validatePhase(currentPhase)) setPhase(target);
  }

  if (prev) setPhase(Number(prev.dataset.prev));

  if (tab && !tab.disabled) setPhase(Number(tab.dataset.phase));
});

form.addEventListener("change", updateInsights);
document.querySelector("#refreshRecommendations").addEventListener("click", () => {
  renderFollowUps();
  renderRecommendations();
});

renderCoreQuestions();
updateInsights();
