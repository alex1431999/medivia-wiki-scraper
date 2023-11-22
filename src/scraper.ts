import axios from "axios";
import _ from "lodash";

class Scraper {
  async scrape(url: string): Promise<string> {
    return (await axios.get(url)).data;
  }

  navigateTo(content: string, target: string): string {
    let contentCopy = _.cloneDeep(content)

    while (contentCopy.length !== 1) {
      if (contentCopy.startsWith(target)) {
        return contentCopy.slice(target.length)
      }

      contentCopy = contentCopy.slice(1)
    }

    throw Error('Did not find target')
  }

  extract(content: string, end: string): string {
    let contentCopy = _.cloneDeep(content)

    for (let i = 0; i < content.length; i += 1) {
      if (contentCopy.startsWith(end)) {
        return content.slice(0, i);
      }

      contentCopy = contentCopy.slice(1)
    }

    throw Error('Did not find end')
  }

  runExtractionSequence<T>(content: string, sequence: (content: string) => { content: string, data: T }): T[] {
    const dataExtracted: T[] = []

    while (true) {
      try {
        const result = sequence(content)
        dataExtracted.push(result.data)
        content = result.content
      } catch (error) {
        return dataExtracted
      }
    }
  }
}
export default new Scraper()