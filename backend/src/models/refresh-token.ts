import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String
    }
  });

  const refreshTokenModel = mongoose.model<{refreshToken: string} & mongoose.Document>('RefreshToken', refreshTokenSchema);

  export default refreshTokenModel;