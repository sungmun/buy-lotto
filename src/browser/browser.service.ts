import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Browser, Cookie, Page, chromium } from 'playwright';
import { parse } from 'querystring';

@Injectable()
export class BrowserService {
  public pages: Array<Page>;
  private index: number;
  private browser: Browser;
  constructor(browser: Browser) {
    this.browser = browser;
    this.pages = new Array();
    this.index = 0;
  }

  public static async openBrowser() {
    const browser = await chromium.launch();

    return new BrowserService(browser);
  }

  async moveTab(index: number) {
    if (this.pages.length - 1 < index) {
      throw new Error('존재하지 않는 탭입니다');
    }
    this.index = index - 1;
  }

  async screenshot() {
    const time = dayjs().format('hh:mm:ss');
    this.pages[this.index].screenshot({
      path: `./page-screenshots/${time}.png`,
    });
    return `./page-screenshots/${time}.png`;
  }

  async newTab() {
    const page = await this.browser.newPage();
    page.on('load', async (page) => {
      const path = await this.screenshot();
      console.log('[page load]', '[success Screenshot]', page.url(), path);
    });
    page.on('request', async (request) => {
      if (request.url().match(/(.css)|(.js)|(.font)|(.png)|(.jpg)|(.gif)/)) {
        return;
      }
      console.group(
        `[request load] \u001b[1;34m${request.method()} ${request.url()}\u001b[0m`,
      );

      const cookie = await request.headerValue('cookie');
      console.log('[success request coockie]', cookie);
      console.log(
        '[success request session]',
        parse(cookie, '; ')['JSESSIONID'],
      );
      console.groupEnd();
    });

    this.pages.push(page);
    this.index = this.pages.length - 1;
  }

  async newTabUrl(url: string) {
    await this.newTab();
    await this.goto(url);
  }

  async goto(url: string) {
    await this.pages[this.index].goto(url);
  }

  async click(selector: string): Promise<void> {
    await this.pages[this.index].click(selector, { timeout: 0 });
  }

  async fill(selector: string, text: string) {
    await this.pages[this.index].fill(selector, text);
  }

  public get url(): string {
    return this.pages[this.index].url();
  }

  public set coockie(cookies: Cookie[]) {
    this.pages[this.index].context().addCookies(cookies);
  }

  public async getCoockie() {
    return this.pages[this.index].context().cookies();
  }

  end() {
    this.browser.close();
  }
}
