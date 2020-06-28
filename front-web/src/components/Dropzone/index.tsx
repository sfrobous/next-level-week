import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './styles.css';
import { FiUpload } from 'react-icons/fi';

interface ImageDropzoneProps {
  onFileUploaded: (file: File) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    setSelectedFileUrl(URL.createObjectURL(file));
    onFileUploaded(file);
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {
        selectedFileUrl ?
          <img src={selectedFileUrl} alt="Point thumbnail" />
          :
          isDragActive ?
            <p>Adicione aqui a imagem do estabelecimento ...</p> :
            <p>
              <FiUpload />
            Arraste uma imagem aqui ou clique para selecionar uma
            </p>
      }
    </div>
  )
}

export default ImageDropzone;