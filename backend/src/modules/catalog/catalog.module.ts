import { Module } from "@nestjs/common";
import { CatalogIndex } from "./catalog-index.service.js";
import { CatalogController } from "./catalog.controller.js";
import { CatalogService } from "./catalog.service.js";

@Module({
  controllers: [CatalogController],
  providers: [CatalogIndex, CatalogService],
  exports: [CatalogIndex, CatalogService],
})
export class CatalogModule {}
