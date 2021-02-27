const cname = require("./utils").cname;

module.exports = async function () {
  const name_func = await cname();
  const site = await (await fetch("https://mirrors.nju.edu.cn/.mirrorz/site.json")).json();
  const html = await (await fetch("https://r.zenithal.workers.dev/https://mirrors.nju.edu.cn/")).text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const items = Array.from(doc.querySelector("pre").children);
  const mirrors = items.map((item) => {
    if (item.innerText == "../" || !item.innerText.endsWith('/'))
      return null;
    const cname = name_func(item.innerText.slice(0, -1));
    const url = item.getAttribute("href");
    return {
      cname,
      url,
    }
  }).filter((e) => e !== null);

  return {
    site,
    info: [],
    mirrors,
  }
};
