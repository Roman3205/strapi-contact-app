import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({"user-permissions": {
    config: {
        jwt: {
            expiresIn: '20d'
        }
    }
}, "schema-to-ts": true});

export default config;
