import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { PDFDocument } from "pdf-lib";
import * as PDFJS from "pdfjs-dist/webpack";
import styles from './Verify.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CustomPDFViewer = ({pdfFile}) => {

    const [imagesList, setImagesList] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        convertPdfToImages(pdfFile);
    }, [pdfFile]);

    useEffect(() => {
        console.log(imagesList);
    }, [imagesList]);

    const turnLeft = () => {
		setPageNumber(Math.max(1, pageNumber - 1));
		// console.log(pageNumber);
	}

	const turnRight = () => {
		setPageNumber(Math.min(imagesList.length, pageNumber + 1));
		// console.log(pageNumber);
	}

    const convertPdfToImages = async (file) => {
		const pdfDoc = await PDFDocument.create();

		PDFJS.GlobalWorkerOptions.workerSrc =
			"https://mozilla.github.io/pdf.js/build/pdf.worker.js";

		const images = [];
		const uri = URL.createObjectURL(file);
		const pdf = await PDFJS.getDocument({ url: uri }).promise;
		const canvas = document.createElement("canvas");

		for (let i = 0; i < pdf.numPages; i++) {
			const page = await pdf.getPage(i + 1);
			const viewport = page.getViewport({ scale: 1 });
			var context = canvas.getContext("2d");

			canvas.height = viewport.height;
			canvas.width = viewport.width;
			await page.render({ canvasContext: context, viewport: viewport })
				.promise;
			
			images.push(canvas.toDataURL("image/png"));
			const pngImage = await pdfDoc.embedPng(images[i]);

			const page1 = pdfDoc.addPage();
			page1.drawImage(pngImage);
		}
        setImagesList(images);
		const pdfBytes = await pdfDoc.save();

		return pdfBytes;
	};

    // return (
    //     <div>Custom PDF Viewer: 
    //         {
    //             imagesList.map((imageURL) => {
    //                 return <img src={imageURL} />
    //             })
    //         }
    //     </div>
    // );


	return (<div className={styles.docContainer}>
		{(pdfFile) ?
			<div className={styles.documentContainer}>
				<img className={styles.pdfPage} src={imagesList[pageNumber-1]} alt="" />
			</div>
			: "Its nulll"}
		<div className={styles.pageControllerContainer}>
			<button className={styles.leftPageBtn} onClick={turnLeft}><ArrowBackIcon /></button>
			<span className={styles.pageInfoContainer}>{pageNumber} of {imagesList.length}</span>
			<button className={styles.rightPageBtn} onClick={turnRight}><ArrowForwardIcon /></button>
		</div>
	</div>);

}

export default CustomPDFViewer;