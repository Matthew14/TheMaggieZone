import { imageWithTitle } from "@/types";
import { Modal } from "@mui/material";
import Image from "next/image";
import { FC } from "react";

interface ImageModalProps {
  image: imageWithTitle;
  open: boolean;
  onClose: () => void;
}

const ImageModal: FC<ImageModalProps> = ({ image, open, onClose }) => {
  return (
    <Modal
      open={open}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Image src={image.img} alt={image.title} height={1200} width={1200} />
    </Modal>
  );
};

export default ImageModal;
