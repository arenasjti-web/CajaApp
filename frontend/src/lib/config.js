let config = null;

export async function loadConfig() {
  const res = await fetch("/config.json");
  config = await res.json();
  return config;
}

export function getConfig() {
  if (!config) {
    throw new Error("Config not loaded");
  }
  return config;
}
