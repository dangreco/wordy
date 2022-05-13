import { Avatar } from "@components/media";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import { Wordy } from "@wordy/types";
import { AnimatePresence, m, motion } from "framer-motion";
import React, {
  ChangeEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { Button } from ".";
import wordy from "@wordy";
import axios from "axios";
import { useUserStore } from "@wordy/store";
import useDimensions from "react-cool-dimensions";

interface Props {
  size: number;
  user: Wordy.User | undefined;
  isMe: boolean;
  canEdit: boolean;
}

const AvatarUpdater: React.FunctionComponent<Props> = ({
  user,
  size,
  isMe,
  canEdit,
}) => {

  const { observe, width, height } = useDimensions({
    onResize: ({ observe, unobserve }) => {
      unobserve();
      observe();
    },
  });

  const { user: me, setUser } = useUserStore();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(
    undefined
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageDataUrl((await readFile(file)) as string);
    }
  };

  const onComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const save = async () => {
    try {
      const blob = (await getCroppedImg(
        imageDataUrl!,
        croppedAreaPixels!,
        rotation
      ));

      if (!blob) return;

      const { data, error } = await wordy.user.me.generatePhotoUploadUrl(
        "image/jpeg"
      );

      if (!error && data) {
        const { url, signedUrl } = data;

        const file = new File([blob], `photo.png`, { type: blob.type });

        await axios.put(signedUrl, file, {
          headers: {
            "Content-Type": `image/jpeg`,
          },
        });

        const { error: updateError, data: updatedUser } =
          await wordy.user.me.update({
            photoUrl: url,
          });

        setUser(updatedUser);
      }
    } catch (e) {
      console.error(e);
    }

    setImageDataUrl(undefined);
  };

  return (
    <Root>
      <Avatar size={size} user={isMe ? me : user} />
      <AnimatePresence>
        {canEdit ? (
          <EditPhoto
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            onClick={() => fileInput.current?.click()}
          >
            <EditPhotoText>Edit</EditPhotoText>
          </EditPhoto>
        ) : null}
      </AnimatePresence>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple={false}
        hidden
        onChange={onFileChange}
      />
      <Modal
        closeTimeoutMS={500}
        onRequestClose={() => setImageDataUrl(undefined)}
        style={customStyles}
        isOpen={imageDataUrl !== undefined}
      >
        <Container ref={observe}>
          <Cropper
            cropShape={"round"}
            image={imageDataUrl}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={1 / 1}
            cropSize={{ width, height }}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onComplete}
            onZoomChange={setZoom}
          />
        </Container>
        <Button onClick={save}>save</Button>
      </Modal>
    </Root>
  );
};

export default AvatarUpdater;

const readFile = async (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => resolve(reader.result as string),
      false
    );
    reader.readAsDataURL(file);
  });
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "var(--paper)",
    border: "2px solid var(--ink)",
    padding: "1rem",
    width: "16rem",
    maxWidth: "calc(100vw - 6rem)",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.25)",
  },
};

const Root = styled.div`
  border-radius: 50%;
  overflow: hidden;
  position: relative;

  & > * {
    position: relative;
  }
`;
const EditPhoto = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const EditPhotoText = styled.p`
  margin: 0;
  color: var(--paper);
  font-weight: bold;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 14rem;
  margin-bottom: 1rem;
  overflow: hidden;
`;
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: {x: number, y: number, width: number, height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob | undefined> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return undefined
  }

  const rotRad = getRadianAngle(rotation)

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  // draw rotated image
  ctx.drawImage(image, 0, 0)

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0)

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      resolve(blob ?? undefined);
    }, 'image/jpeg')
  })
}