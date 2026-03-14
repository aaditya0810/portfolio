import PyPDF2

try:
    with open('Aadi_ND_resume.pdf', 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        with open('resume_utf8.txt', 'w', encoding='utf-8') as outfile:
            outfile.write(text)
        print("Done")
except Exception as e:
    print(f"Error reading PDF: {e}")
