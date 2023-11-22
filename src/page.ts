import scraper from "./scraper.ts";
import _ from "lodash";
import {Creature, Data, Item} from "./types.ts";

abstract class Page<T> {
  abstract get url(): string

  abstract extractionSequence(content: string): { content: string, data: T }
  abstract insertData(data: Data, dataExtracted: any): Data

  async scrape(data: Data) {
    const content = await scraper.scrape(this.url);

    const dataExtracted = this.extractData(content)

    return this.insertData(data, dataExtracted)
  }

  extractData(content: string): T[] {
    return scraper.runExtractionSequence(content, this.extractionSequence)
  }
}

class CreaturesPage extends Page<Creature> {
  get url(): string {
    return 'https://wiki.mediviastats.info/Creatures';
  }

  extractionSequence(content: string): { content: string, data: Creature } {
    content = scraper.navigateTo(content, '<td style="text-align: left; width: 195px">')
    content = scraper.navigateTo(content, 'href="')

    const relativePath = scraper.extract(content, '"')
    const url = `https://wiki.mediviastats.info${relativePath}`

    content = scraper.navigateTo(content, '">')

    const name = scraper.extract(content, "</a>")

    return { content, data: { url, name }}
  }

  insertData(data: Data, dataExtracted: any): Data {
    data.creatures = dataExtracted
    return data
  }
}

class ZiyadPage extends Page<Item> {
  get url(): string {
    return "https://wiki.mediviastats.info/Ziyad";
  }

  extractionSequence(content: string) : { content: string, data: Item } {
    content = scraper.navigateTo(content, '<td><a')
    content = scraper.navigateTo(content, 'title="')

    const itemName = scraper.extract(content, '"')

    content = scraper.navigateTo(content, '<td style')
    content = scraper.navigateTo(content, '">')

    const price = scraper.extract(content, " gp")
    const priceWithoutComma = price.replace(",", "") // Remove commas
    const priceCasted = _.toNumber(priceWithoutComma)

    return { content, data: {  name: itemName, price: priceCasted, sellto: 'Ziyad'  }}

  }

  insertData(data: Data, dataExtracted: Item[]): Data {
    data.items = data.items.concat(dataExtracted)
    return data
  }
}

export default [
  new ZiyadPage(),
  new CreaturesPage()
]