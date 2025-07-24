import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateFcmTokenDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    fcmToken: string;
}