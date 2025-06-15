import proxy from "express-http-proxy";
import { ApiError } from "@sourabhyalagod/helper";

export const handleProxy = (url: string) => {
  console.log("here");

  return proxy(url, {
    proxyReqOptDecorator(proxyReqOpts: any, srcReq: any) {
      if (srcReq.userId) {
        proxyReqOpts.headers["x-user-id"] = srcReq.userId;
      }
      if (srcReq.headers.authorization) {
        proxyReqOpts.headers["authorization"] = srcReq.headers.authorization;
      }

      return proxyReqOpts;
    },
    proxyErrorHandler(err, res, next) {
      return res.status(500).json({
        message: err?.message || "Proxy error",
        status: 500,
      });
    },
  });
};
