/**
 * Client-Side PDF Extractor
 * Supports 25MB - 30MB PDFs seamlessly by extracting text or rendering compressed pages
 * directly in the browser, completely avoiding Vercel's 4.5MB request payload limit.
 */

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export interface PdfExtractResult {
  success: boolean;
  text?: string;
  numPages: number;
  isScanned: boolean;
  pageImageBase64?: string;
  error?: string;
}

let pdfJsPromise: Promise<any> | null = null;

function loadPdfJs(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window not available'));
  }

  if (window.pdfjsLib) {
    return Promise.resolve(window.pdfjsLib);
  }

  if (pdfJsPromise) {
    return pdfJsPromise;
  }

  pdfJsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('PDF.js failed to initialize on window'));
      }
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  return pdfJsPromise;
}

export async function extractPdfContent(
  file: File,
  maxPagesToExtract: number = 25,
  onProgress?: (current: number, total: number) => void
): Promise<PdfExtractResult> {
  try {
    const pdfjs = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const totalPages = pdfDoc.numPages;
    const pagesToRead = Math.min(totalPages, maxPagesToExtract);

    let extractedText = '';

    for (let i = 1; i <= pagesToRead; i++) {
      if (onProgress) {
        onProgress(i, pagesToRead);
      }
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .filter(Boolean)
        .join(' ');

      if (pageText.trim()) {
        extractedText += `\n--- [Page ${i} / ${totalPages}] ---\n` + pageText.trim();
      }
    }

    // Check if the PDF has digital text (at least 120 chars across read pages)
    const hasDigitalText = extractedText.replace(/--- \[Page \d+ \/ \d+\] ---/g, '').trim().length > 120;

    if (hasDigitalText) {
      return {
        success: true,
        text: extractedText.trim(),
        numPages: totalPages,
        isScanned: false
      };
    }

    // If it is a scanned image PDF (no text found), render the first page on canvas as compressed JPEG
    const firstPage = await pdfDoc.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context could not be created');
    }

    await firstPage.render({ canvasContext: ctx, viewport }).promise;
    // Compress to JPEG under 250KB
    const pageImageBase64 = canvas.toDataURL('image/jpeg', 0.8);

    return {
      success: true,
      text: '',
      numPages: totalPages,
      isScanned: true,
      pageImageBase64
    };
  } catch (error: any) {
    console.error('PDF extraction error:', error);
    return {
      success: false,
      numPages: 0,
      isScanned: false,
      error: error?.message || 'Failed to parse PDF'
    };
  }
}
