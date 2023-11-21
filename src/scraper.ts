import axios from "axios";
import _ from "lodash";

class Scraper {
  async scrape(url: string): Promise<string> {
    return (await axios.get(url)).data;
  }

  navigateTo(content: string, target: string) {
    let contentCopy = _.cloneDeep(content)

    while (contentCopy.length !== 1) {
      if (contentCopy.startsWith(target)) {
        return contentCopy.slice(target.length)
      }

      contentCopy = contentCopy.slice(1)
    }

    throw Error('Did not find target')
  }

  extract(content: string, end: string) {
    let contentCopy = _.cloneDeep(content)

    for (let i = 0; i < content.length; i += 1) {
      if (contentCopy.startsWith(end)) {
        return content.slice(0, i);
      }

      contentCopy = contentCopy.slice(1)
    }

    throw Error('Did not find end')
  }
}
export default new Scraper()