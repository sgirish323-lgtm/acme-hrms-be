const isDevEnv = process.env.NODE_ENV === 'development';

const isValidUUID = (uuid: string): boolean => {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(uuid);
};

// eslint-disable-next-line no-console
const logger = console;

export { isDevEnv, isValidUUID, logger };
