import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import useGetCategories from "@/hook/categories/useGetCategories";
import { useUploadProfileImage } from "@/hook/files/useUpload";
import { useCreateEvent } from "@/hook/events/useCreateEvent";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import EventCreatePage from "@/app/(event)/event/create/page";

// Мокаем зависимости
jest.mock("../hook/events/useGetCategories");
jest.mock("../hook/files/useUpload");
jest.mock("../hook/events/useCreateEvent");
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("../components/custom/events/ImageByIdComponent", () => () => (
  <div data-testid="image-by-id" />
));

describe("EventCreatePage", () => {
  const pushMock = jest.fn();
  const uploadImageMock = jest.fn();
  const createEventMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useGetCategories as jest.Mock).mockReturnValue({
      categories: [{ id: "cat1", title: "Категория", color: "#fff" }],
      loadingGetListCategories: false,
      errorGetListCategories: null,
    });
    (useUploadProfileImage as jest.Mock).mockReturnValue({
      uploadImage: uploadImageMock,
      loadingUpload: false,
      errorUpload: null,
    });
    (useCreateEvent as jest.Mock).mockReturnValue({
      createEvent: createEventMock,
      loadingCreateEvent: false,
      errorCreateEvent: null,
    });
  });

  it("показывает загрузку категорий", () => {
    (useGetCategories as jest.Mock).mockReturnValue({
      categories: [],
      loadingGetListCategories: true,
      errorGetListCategories: null,
    });
    render(<EventCreatePage />);
    expect(screen.getByText("Загрузка категорий...")).toBeInTheDocument();
  });

  it("показывает ошибку загрузки категорий", () => {
    (useGetCategories as jest.Mock).mockReturnValue({
      categories: [],
      loadingGetListCategories: false,
      errorGetListCategories: "Ошибка категорий",
    });
    render(<EventCreatePage />);
    expect(screen.getByText("Ошибка категорий")).toBeInTheDocument();
  });

  it("показывает индикатор загрузки изображения и ошибку загрузки", () => {
    (useUploadProfileImage as jest.Mock).mockReturnValue({
      uploadImage: uploadImageMock,
      loadingUpload: true,
      errorUpload: "Ошибка загрузки",
    });
    render(<EventCreatePage />);
    expect(screen.getByText("Загрузка изображения...")).toBeInTheDocument();
    expect(screen.getByText("Ошибка загрузки")).toBeInTheDocument();
  });
});
