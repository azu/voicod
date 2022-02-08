export const createAppMode = (href: string) => {
    const url = new URL(href);
    const shouldNotSave = url.searchParams.has("noSave");
    return {
        get shouldNotSave() {
            return shouldNotSave;
        },
    };
};
