import { Controller, Get, Param } from "@nestjs/common";
import { INFO_PAGES_CONTENT } from "@nivora/shared/data/infoPages";
import { ApiError } from "@nivora/shared/errors";

/** Static customer information pages (req §29), served from the shared content. */
@Controller("content")
export class ContentController {
  @Get("pages/:slug")
  page(@Param("slug") slug: string) {
    const page = INFO_PAGES_CONTENT.find((item) => item.slug === slug);
    if (!page) throw new ApiError("NOT_FOUND", { entity: "page" });
    return page;
  }
}
