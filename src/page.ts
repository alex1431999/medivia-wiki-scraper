import scraper from "./scraper.ts";
import _ from "lodash";
import {Data, Item} from "./types.ts";

abstract class Page {
  abstract get url(): string

  async scrape(data: Data) {
    const content = await scraper.scrape(this.url);

    const dataExtracted = this.extractData(content)

    return this.insertData(data, dataExtracted)
  }

  abstract extractData(content: string): any;
  abstract insertData(data: Data, dataExtracted: any): Data
}

class ZiyadPage extends Page {
  get url(): string {
    return "https://wiki.mediviastats.info/Ziyad";
  }

  extractData(content: string): Item[] {
    const items: Item[] = []

    while (true) {
      try {
        content = scraper.navigateTo(content, '<td><a')
        content = scraper.navigateTo(content, 'title="')
      } catch (e) {
        // This means we are done
        return items
      }

      const itemName = scraper.extract(content, '"')

      content = scraper.navigateTo(content, '<td style')
      content = scraper.navigateTo(content, '">')

      const price = scraper.extract(content, " gp")


      const priceWithoutComma = price.replace(",", "") // Remove commas

      if (_.isNaN(priceWithoutComma)) {
        throw Error(`Value extracted for ${itemName} is not a number but ${priceWithoutComma} instead`)
      }

      const priceCasted = _.toNumber(priceWithoutComma)

      items.push({ name: itemName, price: priceCasted, sellto: 'Ziyad' })
    }
  }

  insertData(data: Data, dataExtracted: Item[]): Data {
    data.items = data.items.concat(dataExtracted)
    return data
  }
}

export default [
  new ZiyadPage()
]