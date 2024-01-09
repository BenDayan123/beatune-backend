import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, User, UserSchema } from './user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PlaylistModule } from '@database/playlist/playlist.module';
// import autopopulate from 'mongoose-autopopulate'
import * as bcrypt from 'bcrypt';

const { GEN_SALT } = process.env;

const hash_password = function (next) {
  const user = this;
  // if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, +GEN_SALT, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
};

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre<UserDocument>('save', hash_password);
          schema.pre<UserDocument>('updateOne', hash_password);

          // schema.plugin(autopopulate)
          return schema;
        },
      },
    ]),
    forwardRef(() => PlaylistModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
