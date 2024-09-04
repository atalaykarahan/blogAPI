import express from 'express';

declare global {
    namespace Express {
        interface Request {
            fileUUID?: string;
        }
    }
}
