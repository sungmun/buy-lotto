import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DonghangService } from './donghang/donghang.service';
import { SELECTORS } from './donghang/donghang.const';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const donghangService = app.get(DonghangService);
  await donghangService.init();
  await donghangService.login(process.env.ID, process.env.PASSWORD);
  const sampleLottoNumbersList = [[1, 2, 3, 4, 5, 6]];
  await donghangService.gamaPage((service) => {
    sampleLottoNumbersList.map((lottoNumbers) => {
      lottoNumbers
        .reduce(
          async (promise, lottoNumber) =>
            promise.then(async () =>
              service.click(
                `${SELECTORS.PURCHASE_CHECK_NUMBER_GROUP_SELECT} > label:nth-child(${lottoNumber * 2 + 1})`,
              ),
            ),
          Promise.resolve(),
        )
        .then(async () => {
          await service.screenshot();
          await service.click(SELECTORS.GAME_CHECK_BTN_SELECT);
          await service.screenshot();
        });
    });
  });

  setTimeout(() => {
    donghangService.browserService.end();
    process.exit();
  }, 10000);
}
bootstrap();
