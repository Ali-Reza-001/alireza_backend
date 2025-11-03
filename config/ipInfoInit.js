
const ipChecker = async (ip) => {
  try {
    const response = await fetch(`https://api.ipinfo.io/lite/${ip}?token=${process.env.IPINFO_TOKEN}`);
    if (!response.ok) throw new Error(`IPinfo responded with status ${response.status}`);

    const ipInfo = await response.json();
    return ipInfo;
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return { ip }; // fallback minimal info
  }
};

module.exports = ipChecker;
