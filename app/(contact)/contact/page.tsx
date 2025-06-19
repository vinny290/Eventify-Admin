"use client";

import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

export default function ContactPage() {
  const email = "support@eventify.website";
  const qrSrc = "/images/eventify-tg-qr.svg"; // Поместите QR-код в public/images/qr-code.png

  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Контакты</CardTitle>
          <CardDescription>Свяжитесь с нами удобным способом</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-72 h-72 relative">
              <Image
                src={qrSrc}
                alt="QR-код"
                fill
                className="object-contain rounded-md"
              />
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label className="text-base">Email</Label>
              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-2 hover:underline"
              >
                <Mail className="w-5 h-5" />
                <span>{email}</span>
              </a>
            </div>
          </div>
          <div>
            <Button asChild>
              <a href={`mailto:${email}`}>Написать нам</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
