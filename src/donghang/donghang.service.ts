import { Injectable } from '@nestjs/common';
import { BrowserService } from 'src/browser/browser.service';
import { SELECTORS, URLS } from './donghang.const';

import { Cookie } from 'playwright';

@Injectable()
export class DonghangService {
  browserService: BrowserService;
  coockie: Cookie[];
  constructor() {}

  async init() {
    this.browserService = await BrowserService.openBrowser();
  }

  async login(id: string, password: string) {
    if (this.coockie) {
      this.browserService.coockie = this.coockie;
    }
    await this.browserService.newTabUrl(URLS.LOGIN_URL);

    if (
      new URL(this.browserService.url).pathname ===
      new URL(URLS.LOGIN_URL).pathname
    ) {
      await this.browserService.fill(SELECTORS.ID_SELECT, id);
      await this.browserService.fill(SELECTORS.PW_SELECT, password);
      await this.browserService.click(SELECTORS.LOGIN_BUTTON_SELECT);
    }

    if (
      new URL(this.browserService.url).pathname ===
      new URL(URLS.LOGIN_URL).pathname
    ) {
      throw new Error('로그인 실패(아이디/비밀번호를 확인해주세요.)');
    }

    this.coockie = await this.browserService.getCoockie();
  }

  async gamaPage(gamePageCallback: (browserService: BrowserService) => void) {
    await this.browserService.newTab();
    this.browserService.coockie = this.coockie;
    await this.browserService.goto(URLS.LOTTO_GAME_URL);
    gamePageCallback(this.browserService);
  }

  endProcess(callback) {
    callback();
  }
}
