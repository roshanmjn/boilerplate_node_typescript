const responseHandler = (response: unknown, statusCode: number = 200) => ({
    status: statusCode ? statusCode : 200,
    success: true,
    // @ts-ignore
    data: typeof response === "object" ? response : { ...response },
});

export { responseHandler };
