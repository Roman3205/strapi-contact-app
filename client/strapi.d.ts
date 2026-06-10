import type { Strapi5ResponseMeta } from "@nuxtjs/strapi";

declare global {
    interface FindMany<T> {
        data: T[];
        meta: Strapi5ResponseMeta;
    }
    interface FindOne<T> {
        data: T;
        meta: Strapi5ResponseMeta;
    }
}

export {}