const STORAGE_KEY = "youtube-log-records-v1";

const formElement = document.getElementById("logForm");
const inputElement = document.getElementById("urlInput");
const hintElement = document.getElementById("hintText");
const listElement = document.getElementById("logList");
const emptyStateElement = document.getElementById("emptyState");
const totalCountElement = document.getElementById("totalCount");
const doneCountElement = document.getElementById("doneCount");
const pendingCountElement = document.getElementById("pendingCount");
const completeAllButton = document.getElementById("completeAllButton");
const clearAllButton = document.getElementById("clearAllButton");
const deleteModalElement = document.getElementById("deleteModal");
const deleteCancelButton = document.getElementById("deleteCancelButton");
const deleteConfirmButton = document.getElementById("deleteConfirmButton");

let records = loadRecords();
const titleFetchInFlight = new Set();
let isDeleteModalOpen = false;

function loadRecords() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        id: String(item.id ?? crypto.randomUUID()),
        url: String(item.url ?? ""),
        title: String(item.title ?? ""),
        thumbnailUrl: String(item.thumbnailUrl ?? ""),
        isDone: Boolean(item.isDone),
        createdAt: Number(item.createdAt ?? Date.now()),
      }))
      .filter((item) => item.url.length > 0);
  } catch {
    return [];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function normalizeUrl(rawUrl) {
  const trimmedValue = rawUrl.trim();
  const parsedUrl = new URL(trimmedValue);
  const host = parsedUrl.hostname.replace(/^www\./, "");
  const isYoutubeHost =
    host === "youtube.com" ||
    host.endsWith(".youtube.com") ||
    host === "youtu.be";

  if (!isYoutubeHost) {
    throw new Error("유튜브 URL만 저장할 수 있습니다.");
  }

  return parsedUrl.toString();
}

function getFallbackTitle(url) {
  try {
    const parsedUrl = new URL(url);
    const videoId = parsedUrl.searchParams.get("v");

    if (videoId) {
      return `YouTube 영상 ID: ${videoId}`;
    }

    const shortId = parsedUrl.pathname.split("/").filter(Boolean).pop();
    if (shortId) {
      return `YouTube 링크: ${shortId}`;
    }
  } catch {
    // fall through
  }

  return "YouTube 학습 영상";
}

function getDisplayTitle(record) {
  return record.title || getFallbackTitle(record.url);
}

function extractVideoId(url) {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
    }

    return parsedUrl.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

function buildEmbedUrl(url) {
  const videoId = extractVideoId(url);

  if (!videoId) {
    return "";
  }

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1&modestbranding=1&iv_load_policy=3`;
}

function hasDuplicateRecord(url) {
  const nextVideoId = extractVideoId(url);

  return records.some((record) => {
    const currentVideoId = extractVideoId(record.url);

    if (nextVideoId && currentVideoId) {
      return nextVideoId === currentVideoId;
    }

    return record.url === url;
  });
}

async function fetchYoutubeMetadata(url) {
  const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);

  if (!response.ok) {
    throw new Error("제목을 불러오지 못했습니다.");
  }

  const data = await response.json();
  if (!data || typeof data.title !== "string" || data.title.trim().length === 0) {
    throw new Error("제목을 찾을 수 없습니다.");
  }

  return {
    title: data.title.trim(),
    thumbnailUrl: typeof data.thumbnail_url === "string" ? data.thumbnail_url : "",
  };
}

async function resolveRecordMetadata(recordId, url) {
  if (titleFetchInFlight.has(recordId)) {
    return;
  }

  titleFetchInFlight.add(recordId);

  try {
    const metadata = await fetchYoutubeMetadata(url);

    records = records.map((record) => {
      if (record.id !== recordId) {
        return record;
      }

      return {
        ...record,
        title: metadata.title,
        thumbnailUrl: metadata.thumbnailUrl,
      };
    });

    saveRecords();
    renderRecords();
  } catch {
    records = records.map((record) => {
      if (record.id !== recordId || record.title) {
        return record;
      }

      return {
        ...record,
        title: getFallbackTitle(url),
        thumbnailUrl: "",
      };
    });

    saveRecords();
    renderRecords();
  } finally {
    titleFetchInFlight.delete(recordId);
  }
}

function updateStats() {
  const doneCount = records.filter((record) => record.isDone).length;
  const pendingCount = records.length - doneCount;

  totalCountElement.textContent = String(records.length);
  doneCountElement.textContent = String(doneCount);
  pendingCountElement.textContent = String(pendingCount);
}

function setHint(message, isError = false) {
  hintElement.textContent = message;
  hintElement.style.color = isError ? "#dc2626" : "";
}

function openDeleteModal() {
  isDeleteModalOpen = true;
  deleteModalElement.classList.remove("hidden");
  deleteModalElement.setAttribute("aria-hidden", "false");
  deleteCancelButton.focus();
}

function closeDeleteModal() {
  isDeleteModalOpen = false;
  deleteModalElement.classList.add("hidden");
  deleteModalElement.setAttribute("aria-hidden", "true");
  clearAllButton.focus();
}

function deleteAllRecords() {
  records = [];
  saveRecords();
  renderRecords();
  setHint("모든 기록을 삭제했습니다.");
}

function renderRecords() {
  listElement.innerHTML = "";

  emptyStateElement.classList.toggle("show", records.length === 0);

  const sortedRecords = [...records].sort((a, b) => {
    if (a.isDone !== b.isDone) {
      return Number(a.isDone) - Number(b.isDone);
    }

    return b.createdAt - a.createdAt;
  });

  sortedRecords.forEach((record) => {
    const itemElement = document.createElement("li");
    itemElement.className = `log-item${record.isDone ? " completed" : ""}`;
    itemElement.dataset.id = record.id;

    const thumbnailElement = document.createElement("a");
    thumbnailElement.className = "thumbnail";
    thumbnailElement.href = record.url;
    thumbnailElement.target = "_blank";
    thumbnailElement.rel = "noopener noreferrer";
    thumbnailElement.setAttribute("aria-label", "유튜브 영상 열기");

    const thumbnailImageElement = document.createElement("img");
    thumbnailImageElement.className = "thumbnail-image";
    thumbnailImageElement.alt = "";
    thumbnailImageElement.loading = "lazy";
    thumbnailImageElement.referrerPolicy = "no-referrer";
    thumbnailImageElement.src =
      record.thumbnailUrl || `https://img.youtube.com/vi/${extractVideoId(record.url)}/hqdefault.jpg`;

    thumbnailImageElement.addEventListener("error", () => {
      thumbnailImageElement.src = createFallbackThumbnailDataUrl();
    });

    const thumbnailOverlayElement = document.createElement("div");
    thumbnailOverlayElement.className = "thumbnail-overlay";

    const thumbnailOverlayTextElement = document.createElement("span");
    thumbnailOverlayTextElement.className = "thumbnail-overlay-text";
    thumbnailOverlayTextElement.textContent = "미리보기";

    const thumbnailOverlayTitleElement = document.createElement("strong");
    thumbnailOverlayTitleElement.className = "thumbnail-overlay-title";
    thumbnailOverlayTitleElement.textContent = getDisplayTitle(record);

    thumbnailOverlayElement.append(thumbnailOverlayTextElement, thumbnailOverlayTitleElement);

    thumbnailElement.appendChild(thumbnailImageElement);
    thumbnailElement.appendChild(thumbnailOverlayElement);

    const previewBubbleElement = document.createElement("div");
    previewBubbleElement.className = "preview-bubble";

    const previewBubbleHeaderElement = document.createElement("div");
    previewBubbleHeaderElement.className = "preview-bubble-header";
    previewBubbleHeaderElement.textContent = "미리보기 재생";

    const previewBubbleTitleElement = document.createElement("div");
    previewBubbleTitleElement.className = "preview-bubble-title";
    previewBubbleTitleElement.textContent = getDisplayTitle(record);

    const previewBubbleActionsElement = document.createElement("div");
    previewBubbleActionsElement.className = "preview-bubble-actions";

    const previewOpenButton = document.createElement("button");
    previewOpenButton.type = "button";
    previewOpenButton.className = "preview-bubble-open";
    previewOpenButton.textContent = "새 창에서 열기";
    previewOpenButton.addEventListener("click", () => {
      window.open(record.url, "_blank", "noopener,noreferrer");
    });

    const previewPlayerElement = document.createElement("div");
    previewPlayerElement.className = "preview-player";

    const previewPlaceholderElement = document.createElement("div");
    previewPlaceholderElement.className = "preview-placeholder";
    previewPlaceholderElement.textContent = "마우스를 올리면 영상이 재생됩니다.";

    previewPlayerElement.appendChild(previewPlaceholderElement);
    previewBubbleActionsElement.appendChild(previewOpenButton);
    previewBubbleElement.append(
      previewBubbleHeaderElement,
      previewBubbleTitleElement,
      previewBubbleActionsElement,
      previewPlayerElement,
    );

    let previewHideTimerId = null;
    let previewIframeElement = null;

    const showPreviewBubble = () => {
      if (previewHideTimerId) {
        clearTimeout(previewHideTimerId);
        previewHideTimerId = null;
      }

      previewBubbleElement.classList.add("show");

      if (previewIframeElement) {
        return;
      }

      const embedUrl = buildEmbedUrl(record.url);
      if (!embedUrl) {
        return;
      }

      previewPlayerElement.innerHTML = "";
      previewIframeElement = document.createElement("iframe");
      previewIframeElement.src = embedUrl;
      previewIframeElement.title = getDisplayTitle(record);
      previewIframeElement.allow = "autoplay; encrypted-media; picture-in-picture";
      previewIframeElement.referrerPolicy = "strict-origin-when-cross-origin";
      previewIframeElement.setAttribute("allowfullscreen", "");
      previewPlayerElement.appendChild(previewIframeElement);
    };

    const hidePreviewBubble = () => {
      if (previewHideTimerId) {
        clearTimeout(previewHideTimerId);
      }

      previewHideTimerId = setTimeout(() => {
        previewBubbleElement.classList.remove("show");

        if (previewIframeElement) {
          previewIframeElement.remove();
          previewIframeElement = null;
        }

        previewPlayerElement.innerHTML = "";
        previewPlaceholderElement.textContent = "마우스를 올리면 영상이 재생됩니다.";
        previewBubbleActionsElement.replaceChildren(previewOpenButton);
        previewPlayerElement.appendChild(previewPlaceholderElement);
      }, 120);
    };

    thumbnailElement.addEventListener("mouseenter", showPreviewBubble);
    thumbnailElement.addEventListener("mouseleave", hidePreviewBubble);
    previewBubbleElement.addEventListener("mouseenter", showPreviewBubble);
    previewBubbleElement.addEventListener("mouseleave", hidePreviewBubble);

    const topElement = document.createElement("div");
    topElement.className = "log-top";

    const metaElement = document.createElement("div");
    metaElement.className = "log-meta";

    const titleElement = document.createElement("p");
    titleElement.className = "log-title";
    titleElement.textContent = getDisplayTitle(record);

    if (!record.title) {
      titleElement.classList.add("loading");
      resolveRecordMetadata(record.id, record.url);
    }

    const urlElement = document.createElement("span");
    urlElement.className = "log-url";
    urlElement.textContent = record.url;

    metaElement.append(titleElement, urlElement);

    const badgeElement = document.createElement("span");
    badgeElement.className = `badge${record.isDone ? " done" : ""}`;
    badgeElement.textContent = record.isDone ? "학습 완료" : "학습 중";

    topElement.append(metaElement, badgeElement);

    const actionElement = document.createElement("div");
    actionElement.className = "log-actions";

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "item-btn open";
    openButton.textContent = "새 창에서 열기";
    openButton.addEventListener("click", () => {
      window.open(record.url, "_blank", "noopener,noreferrer");
    });

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = `item-btn toggle${record.isDone ? " completed" : ""}`;
    toggleButton.textContent = record.isDone ? "미완료로 변경" : "완료 표시";
    toggleButton.addEventListener("click", () => {
      records = records.map((item) => {
        if (item.id !== record.id) {
          return item;
        }

        return {
          ...item,
          isDone: !item.isDone,
        };
      });

      saveRecords();
      updateStats();
      renderRecords();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "item-btn delete";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", () => {
      const nextCount = records.length;
      records = records.filter((item) => item.id !== record.id);
      saveRecords();
      updateStats();
      renderRecords();

      if (records.length < nextCount) {
        setHint("선택한 URL을 삭제했습니다.");
      }
    });

    actionElement.append(openButton, toggleButton, deleteButton);
    const contentElement = document.createElement("div");
    contentElement.className = "log-content";
    contentElement.append(topElement, actionElement);

    itemElement.append(thumbnailElement, contentElement, previewBubbleElement);
    listElement.appendChild(itemElement);
  });

  updateStats();
}

formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const normalizedUrl = normalizeUrl(inputElement.value);

    if (hasDuplicateRecord(normalizedUrl)) {
      setHint("이미 저장된 동영상입니다.", true);
      inputElement.focus();
      inputElement.select();
      return;
    }

    records = [
      {
        id: crypto.randomUUID(),
        url: normalizedUrl,
        title: "",
        thumbnailUrl: "",
        isDone: false,
        createdAt: Date.now(),
      },
      ...records,
    ];

    saveRecords();
    renderRecords();
    inputElement.value = "";
    inputElement.focus();
    setHint("URL을 저장했습니다.");
  } catch (error) {
    setHint(error instanceof Error ? error.message : "URL을 저장하지 못했습니다.", true);
  }
});

clearAllButton.addEventListener("click", () => {
  if (records.length === 0) {
    setHint("삭제할 기록이 없습니다.");
    return;
  }

  openDeleteModal();
});

deleteCancelButton.addEventListener("click", closeDeleteModal);

deleteConfirmButton.addEventListener("click", () => {
  closeDeleteModal();
  deleteAllRecords();
});

deleteModalElement.addEventListener("click", (event) => {
  if (event.target === deleteModalElement) {
    closeDeleteModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isDeleteModalOpen) {
    closeDeleteModal();
  }
});

completeAllButton.addEventListener("click", () => {
  if (records.length === 0) {
    setHint("완료할 기록이 없습니다.");
    return;
  }

  const hasPendingRecord = records.some((record) => !record.isDone);

  if (!hasPendingRecord) {
    setHint("이미 모든 동영상이 완료 상태입니다.");
    return;
  }

  records = records.map((record) => ({
    ...record,
    isDone: true,
  }));

  saveRecords();
  renderRecords();
  setHint("모든 동영상을 완료 표시했습니다.");
});

renderRecords();

function createFallbackThumbnailDataUrl() {
  return (
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">' +
        '<rect width="480" height="270" fill="#111111"/>' +
        '<rect x="28" y="28" width="424" height="214" rx="20" fill="#1f1f22"/>' +
        '<circle cx="240" cy="135" r="34" fill="#ef4444"/>' +
        '<polygon points="228,118 228,152 258,135" fill="#ffffff"/>' +
      '</svg>'
    )
  );
}
