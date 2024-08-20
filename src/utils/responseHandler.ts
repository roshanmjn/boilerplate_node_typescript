const responseHandler = (response: unknown, status = "success") => ({
    // statusCode: statusCode ? statusCode : 200,
    status: status,
    // @ts-ignore
    data: typeof response === "object" ? response : { ...response },
});

export { responseHandler };
