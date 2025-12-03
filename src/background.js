const browser = globalThis.browser || globalThis.chrome;

const BASE_URL =
  "https://powerpacks.gamestop.com/collection/api/trpc/collection.list";
const COOKIE_URL = "https://powerpacks.gamestop.com";
const COOKIE_NAME = "CXPowerPacks_accessToken";

const REQUEST_HEADERS = {
  "cache-control": "no-cache",
  "trpc-accept": "application/json",
  "x-trpc-source": "nextjs-react",
};

const QUERY_CONFIGS = [
  {
    name: "ACTIVE",
    params: {
      collectibleStatusFilters: ["ACTIVE"],
      sortOrder: "DESC",
      sortBy: ["CREATED_DATE"],
      userSettings: { showSetRegistryCollectibles: true },
      direction: "forward",
    },
  },
  {
    name: "SOLD",
    params: {
      collectibleStatusFilters: ["SOLD"],
      sortOrder: "DESC",
      sortBy: ["LISTING_DETAILS_PAYMENT_DATE"],
      filters: {},
      userSettings: { showSetRegistryCollectibles: true },
      direction: "forward",
    },
  },
];

function jsonToHex(obj) {
  const jsonStr = JSON.stringify(obj);
  return Array.from(jsonStr)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

function buildTrpcUrl(params) {
  const hex = jsonToHex(params);
  const input = encodeURIComponent(JSON.stringify({ 0: hex }));
  return `${BASE_URL}?batch=1&input=${input}`;
}

async function checkCookie() {
  try {
    const cookie = await browser.cookies.get({
      url: COOKIE_URL,
      name: COOKIE_NAME,
    });
    return cookie !== null;
  } catch (error) {
    console.error("Error checking cookie:", error);
    return false;
  }
}

async function fetchPage(params, cursor = null, retries = 3) {
  const queryParams = cursor ? { ...params, cursor } : { ...params };
  const url = buildTrpcUrl(queryParams);

  const response = await fetch(url, {
    method: "GET",
    headers: REQUEST_HEADERS,
    credentials: "include",
  });

  if (response.status === 429 && retries > 0) {
    const delay = parseInt(response.headers.get("Retry-After") || "5", 10) * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchPage(params, cursor, retries - 1);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data[0]?.result?.data?.json || null;
}

async function fetchAllPages(config, onProgress) {
  const allCollectibles = [];
  let cursor = 0;

  while (true) {
    const page = await fetchPage(config.params, cursor++);
    if (!page || !page.collectibles || page.collectibles.length === 0) {
      break;
    }

    allCollectibles.push(...page.collectibles);
    onProgress?.({
      type: config.name,
      items: allCollectibles.length,
      total: page.totalItems,
    });

    if (page.pageOffset + page.pageSize >= page.totalItems) {
      break;
    }
  }

  return allCollectibles;
}

async function fetchAllCollections(onProgress) {
  const allItems = [];

  for (const config of QUERY_CONFIGS) {
    onProgress?.({ status: "fetching", type: config.name });
    const items = await fetchAllPages(config, onProgress);
    allItems.push(...items);
  }

  return allItems;
}

function generateJsonLines(items) {
  return items.map((item) => JSON.stringify(item)).join("\n");
}

// Message handler for popup communication
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkCookie") {
    checkCookie().then(sendResponse);
    return true;
  }

  if (message.action === "fetchCollections") {
    (async () => {
      try {
        const hasCookie = await checkCookie();
        if (!hasCookie) {
          sendResponse({
            success: false,
            error: "No valid access token found. Please log in to PowerPacks.",
          });
          return;
        }

        const items = await fetchAllCollections((progress) => {
          browser.runtime.sendMessage({ action: "progress", ...progress });
        });

        const jsonLines = generateJsonLines(items);
        sendResponse({ success: true, data: jsonLines, count: items.length });
      } catch (error) {
        console.error("Error fetching collections:", error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }
});
